import { defineStore } from 'pinia';

export const useSurveyStore = defineStore('form', {
  state: () => ({
    activePage: 1,
    
  }),
  actions: {
    setAnswer() {

    },
    nextPage() {
        this.activePage += 1;
    },
    prevPage() {
      if (this.activePage > 1) {
        this.activePage -= 1;
      }
    },
    goToPage(pageNumber) {
      this.activePage = pageNumber;
    }
  }
});
