<template>
<simple-form-dialog
  ref="form"
  :title="$t('StudyPopulationForm.title')"
  :help-items="helpItems"
  @close="cancel"
  @submit="submit"
  :open="open"
  >
  <template v-slot:body>
    <validation-observer ref="observer">
      <v-row class="pr-4">
        <v-col cols="11">
          <validation-provider
            v-slot="{ errors }"
            name="Species"
            >
            <v-autocomplete
              data-cy="species"
              v-model="form.species_code"
              :label="$t('StudyPopulationForm.species')"
              :items="species"
              item-text="sponsor_preferred_name"
              item-value="term_uid"
              return-object
              :error-messages="errors"
              dense
              clearable
              ></v-autocomplete>
          </validation-provider>
        </v-col>
      </v-row>
      <v-row class="pr-4">
        <v-col cols="11">
          <validation-provider
            v-slot="{ errors }"
            name="strain"
            rules=""
            >
            <multiple-select
              v-model="form.strain_codes"
              :data-cy="$t('StudyPopulationForm.strain')"
              :label="$t('StudyPopulationForm.strain')"
              :items="strain"
              item-value="term_uid"
              item-text="sponsor_preferred_name"
              return-object
              :errors="errors"
              />
          </validation-provider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            :data-cy="$t('StudyPopulationForm.number_of_males')"
            v-model="form.number_of_males"
            :label="$t('StudyPopulationForm.number_of_males')"
            :hint="$t('StudyPopulationForm.number_of_males_hint')"
            class="pt-0 my-0"
            type="number"
            />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            :data-cy="$t('StudyPopulationForm.number_of_females')"
            v-model="form.number_of_females"
            :label="$t('StudyPopulationForm.number_of_females')"
            :hint="$t('StudyPopulationForm.number_of_females_hint')"
            class="pt-0 my-0"
            type="number"
            />
        </v-col>
      </v-row>
    </validation-observer>
  </template>
</simple-form-dialog>
</template>

<script>
import _isEqual from 'lodash/isEqual'
import { mapGetters } from 'vuex'
import { bus } from '@/main'
import { studyMetadataFormMixin } from '@/mixins/studyMetadataForm'
import MultipleSelect from '@/components/tools/MultipleSelect'
import SimpleFormDialog from '@/components/tools/SimpleFormDialog'

export default {
  mixins: [studyMetadataFormMixin],
  components: {
    MultipleSelect,
    SimpleFormDialog
  },
  props: {
    metadata: Object,
    open: Boolean
  },
  computed: {
    ...mapGetters({
      selectedStudy: 'studiesGeneral/selectedStudy',
      snomedTerms: 'studiesGeneral/snomedTerms',
      species: 'studiesGeneral/species',
      strain: 'studiesGeneral/strain',
      nullValues: 'studiesGeneral/nullValues'
    })
  },
  data () {
    return {
      form: {
        number_of_males: {},
        number_of_females: {}
      },
      helpItems: [
        'StudyPopulationForm.species',
        'StudyPopulationForm.strain',
        'StudyPopulationForm.number_of_males',
        'StudyPopulationForm.number_of_females'
      ],
      minimumDurationCheckbox: false,
      data: this.metadata
    }
  },
  mounted () {
    this.$store.dispatch('studiesGeneral/fetchNullValues')
  },
  methods: {
    close () {
      this.$emit('close')
      this.$refs.observer.reset()
    },
    async cancel () {
      if (_isEqual(this.metadata, this.prepareRequestPayload())) {
        this.close()
        return
      }
      const options = {
        type: 'warning',
        cancelLabel: this.$t('_global.cancel'),
        agreeLabel: this.$t('_global.continue')
      }
      if (await this.$refs.form.confirm(this.$t('_global.cancel_changes'), options)) {
        this.data = {}
        this.data = this.metadata
        this.close()
      }
    },
    prepareRequestPayload () {
      const data = JSON.parse(JSON.stringify(this.form))
      if (Object.keys(data.planned_minimum_age_of_subjects).length === 0 || !data.planned_minimum_age_of_subjects.duration_value) {
        data.planned_minimum_age_of_subjects = null
      }
      if (Object.keys(data.planned_maximum_age_of_subjects).length === 0 || !data.planned_maximum_age_of_subjects.duration_value) {
        data.planned_maximum_age_of_subjects = null
      }
      if (Object.keys(data.stable_disease_minimum_duration).length === 0 || !data.stable_disease_minimum_duration.duration_value) {
        data.stable_disease_minimum_duration = null
      }
      if (!data.number_of_expected_subjects) {
        data.number_of_expected_subjects = null
      }
      data.sex_of_participants_code = this.getTermPayload('sex_of_participants_code')
      data.therapeutic_area_codes = this.getTermsPayload('therapeutic_area_codes')
      data.species_code = this.getTermPayload('species_code')
      data.strain_code = this.getTermPayload('strain_code')
      data.disease_condition_or_indication_codes = this.getTermsPayload('disease_condition_or_indication_codes')
      data.diagnosis_group_codes = this.getTermsPayload('diagnosis_group_codes')
      return data
    },
    async submit () {
      const valid = await this.$refs.observer.validate()
      if (!valid) {
        return
      }
      const data = this.prepareRequestPayload()
      this.$refs.form.working = true
      try {
        await this.$store.dispatch('manageStudies/editStudyPopulation', [this.selectedStudy.uid, data])
        this.$emit('updated', data)
        bus.$emit('notification', { msg: this.$t('StudyPopulationForm.update_success') })
        this.close()
      } finally {
        this.$refs.form.working = false
      }
    }
  },
  watch: {
    minimumDurationCheckbox: function () {
      this.form.stable_disease_minimum_duration = {}
    },
    data: {
      handler: function (value) {
        this.form = JSON.parse(JSON.stringify(value))
        if (!this.form.planned_minimum_age_of_subjects) {
          this.form.planned_minimum_age_of_subjects = {}
        }
        if (!this.form.planned_maximum_age_of_subjects) {
          this.form.planned_maximum_age_of_subjects = {}
        }
        if (!this.form.stable_disease_minimum_duration) {
          this.form.stable_disease_minimum_duration = {}
        }
      },
      immediate: true
    },
    metadata (value) {
      this.data = value
    }
  }
}
</script>
