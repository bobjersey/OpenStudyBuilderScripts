<template>
<study-metadata-summary
  :metadata="metadata"
  :params="params"
  :first-col-label="$t('StudyPopulationSummary.info_column')"
  persistent-dialog
  copy-from-study
  component="study_population"
  >
  <template v-slot:form="{ closeHandler, dataToCopy, openHandler }">
    <study-population-form :open="openHandler" :metadata="(Object.keys(dataToCopy).length !== 0) ? dataToCopy : metadata" @updated="onMetadataUpdated" @close="closeHandler" :debug="true" />
  </template>
</study-metadata-summary>
</template>

<script>
import { mapGetters } from 'vuex'
import study from '@/api/study'
import StudyMetadataSummary from './StudyMetadataSummary'
import StudyPopulationForm from './StudyPopulationForm'

export default {
  components: {
    StudyMetadataSummary,
    StudyPopulationForm
  },
  computed: {
    ...mapGetters({
      selectedStudy: 'studiesGeneral/selectedStudy',
      species: 'studiesGeneral/species',
      strain: 'studiesGeneral/strain'
    })
  },
  data () {
    return {
      metadata: {},
      params: [
        {
          label: this.$t('StudyPopulationForm.species'),
          name: 'species_code',
          valuesDisplay: 'terms'
        },
        {
          label: this.$t('StudyPopulationForm.strain'),
          name: 'strain_codes',
          valuesDisplay: 'terms'
        },
        {
          label: this.$t('StudyPopulationForm.number_of_males'),
          name: 'number_of_males'
        },
        {
          label: this.$t('StudyPopulationForm.number_of_females'),
          name: 'number_of_females'
        }
      ]
    }
  },
  methods: {
    onMetadataUpdated (metadata) {
      this.metadata = metadata
    }
  },
  created () {
    this.$store.dispatch('studiesGeneral/fetchSpecies')
    this.$store.dispatch('studiesGeneral/fetchStrain')
    study.getStudyPopulationMetadata(this.selectedStudy.uid).then(resp => {
      this.metadata = resp.data.current_metadata.study_population
    })
  }
}
</script>
