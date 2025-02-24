import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    activePage: 1,

    business_type_id: null,
    business_type_name:'',
    shop_name: '',
    shop_address: '',
    shop_phone: '',
    shop_details: '',
    image_profile: '',
    business_list:[]   
  }),
  actions: {
    setStep1(business_type_id, business_type_name,shop_name,shop_address,shop_phone,shop_details) {
      this.business_type_id = business_type_id;
      this.business_type_name = business_type_name;
      this.shop_name = shop_name;
      this.shop_address = shop_address;
      this.shop_phone = shop_phone;
      this.shop_details = shop_details;
      

    },
    setStep2(image_profile) {
      this.image_profile = image_profile;
    },
    nextPage() {
      // if (this.activePage < 7) {
        this.activePage += 1;
      // }
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
