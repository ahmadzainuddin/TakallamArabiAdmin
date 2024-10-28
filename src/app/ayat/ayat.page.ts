import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

interface Ayat {
  id: number;
  melayu: string;
  indonesia: string;
  english: string;
  arabic_fusha: string;
  arabic_ammiyah_jordan: string;
  arabic_ammiyah_saudi: string;
}

@Component({
  selector: 'app-ayat',
  templateUrl: './ayat.page.html',
  styleUrls: ['./ayat.page.scss'],
})
export class AyatPage implements OnInit {
  ayat: any[] = [];
  haikal: any[] = [];
  page: number = 1;
  totalPages: number = 0;
  searchMelayu: string = ''; // Search by name
  searchEnglish: string = ''; // Search by phone

  id: string | null = null;
  caption: string | null = null;
  langguage_wav: string | null = null;

  currentCaption:string | null = null;

  constructor(
    private menu: MenuController,
    private route: ActivatedRoute,
    private crudService: CrudService,
    private alertController: AlertController,
    private navCtrl: NavController) { }

    navigateToAyatOpen(id: number, caption: any, langguage: any, langguage_wav: any) {
      // Pass only 'melayu' and 'melayu_wav' properties
      const data = {
        id: id,
        caption: caption,
        langguage: langguage,
        langguage_wav: langguage_wav
      };
      this.navCtrl.navigateForward('/ayatopen', { state: { ayatData: data } });
    }

  // navigateToAyatOpen(a: any) {
  //     this.navCtrl.navigateForward('/ayatopen', { state: { ayatData: a } });
  //   }

  openMenu() {
    this.menu.open('main-menu');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.caption = params['caption'];
      this.langguage_wav = params['langguage_wav'];

      console.log("Received Params:", this.id, this.caption, this.langguage_wav);

      switch (this.caption) {
        case 'Bahasa Melayu':
          this.currentCaption = 'melayu_wav';

          if (this.langguage_wav){
            const item = this.ayat.find(obj => obj.id === this.id);
            if (item && item.melayu_wav !== this.langguage_wav) {
              item.melayu_wav = this.langguage_wav;
              console.log("Updated item:", item);
            } else {
              console.log("Item with ID " + this.id + " not save.");
            }
          }

          break;
          case 'Indonesia':
            this.currentCaption = 'indonesia_wav';

            if (this.langguage_wav){
              const item = this.ayat.find(obj => obj.id === this.id);
              if (item && item.indonesia_wav !== this.langguage_wav) {
                item.indonesia_wav = this.langguage_wav;
                console.log("Updated item:", item);
              } else {
                console.log("Item with ID " + this.id + " not save.");
              }
            }

            break;
        case 'English':
          this.currentCaption = 'english_wav';

          if (this.langguage_wav){
            const item = this.ayat.find(obj => obj.id === this.id);
            if (item && item.english_wav !== this.langguage_wav) {
              item.english_wav = this.langguage_wav;
              console.log("Updated item:", item);
            } else {
              console.log("Item with ID " + this.id + " not save.");
            }
          }

          break;
        case 'Arabic Fusha':
          this.currentCaption = 'arabic_fusha_wav';

          if (this.langguage_wav){
            const item = this.ayat.find(obj => obj.id === this.id);
            if (item && item.arabic_fusha_wav !== this.langguage_wav) {
              item.arabic_fusha_wav = this.langguage_wav;
              console.log("Updated item:", item);
            } else {
              console.log("Item with ID " + this.id + " not save.");
            }
          }

          break;
        case 'Arabic Ammiyah Jordan':
          this.currentCaption = 'arabic_ammiyah_jordan_wav';

          if (this.langguage_wav){
            const item = this.ayat.find(obj => obj.id === this.id);
            if (item && item.arabic_ammiyah_jordan_wav !== this.langguage_wav) {
              item.arabic_ammiyah_jordan_wav = this.langguage_wav;
              console.log("Updated item:", item);
            } else {
              console.log("Item with ID " + this.id + " not save.");
            }
          }

          break;
          case 'Arabic Ammiyah Saudi':
            this.currentCaption = 'arabic_ammiyah_saudi_wav';

            if (this.langguage_wav){
              const item = this.ayat.find(obj => obj.id === this.id);
              if (item && item.arabic_ammiyah_saudi_wav !== this.langguage_wav) {
                item.arabic_ammiyah_saudi_wav = this.langguage_wav;
                console.log("Updated item:", item);
              } else {
                console.log("Item with ID " + this.id + " not save.");
              }
            }

            break;
      }


    });

    this.loadAyat();
  }

  async playWavUrl(url: string) {
    const response = await fetch(url);
    const audioBlob = await response.blob();
    const audioRef = new Audio(URL.createObjectURL(audioBlob));
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }

  viewAyat(){
    console.log('Ayat array:', this.ayat);

    const item = this.ayat.find(obj => obj.id === "5");

    if (item) {
        console.log("Melayu WAV:", item.melayu_wav);
    } else {
        console.log("Item with ID 5 not found.");
    }

    const item2 = this.ayat.find(obj => obj.id === "5");
    if (item2) {
      item2.melayu_wav = 'test.wav';
      console.log("Updated item:", item2);
    } else {
      console.log("Item with ID 5 not found.");
    }

  }

  loadAyat() {
    this.crudService.getAyat(this.page, this.searchMelayu, this.searchEnglish).subscribe((res: any) => {
      this.ayat = res.ayat;
      // console.log('Ayat array:', this.ayat);
      this.totalPages = res.total_pages;
    });
  }

  onSearch() {
    this.page = 1; // Reset to the first page when searching
    this.loadAyat(); // Fetch users based on search criteria
  }

  cancelSearch() {
    this.searchMelayu = ''; // Clear search name
    this.searchEnglish = ''; // Clear search phone
    this.page = 1; // Reset to first page
    this.loadAyat(); // Reload all users (without filters)
  }

  async addAyat() {
    const alert = await this.alertController.create({
      header: 'Add Kalimah / Ayat',
      cssClass: 'custom-alert-input',  // Applying custom CSS class
      inputs: [
        { name: 'melayu', type: 'text', placeholder: 'Bahasa Melayu' },
        { name: 'indonesia', type: 'text', placeholder: 'Bahasa Indonesia' },
        { name: 'english', type: 'text', placeholder: 'English' },
        { name: 'arabic_fusha', type: 'text', placeholder: 'Arabic Fusha' },
        { name: 'arabic_ammiyah_jordan', type: 'text', placeholder: 'Arabic Ammiyah Jordan' },
        { name: 'arabic_ammiyah_saudi', type: 'text', placeholder: 'Arabic Ammiyah Saudi' },

      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: (data) => {
            // data.name = data.name.toUpperCase();
            this.crudService.addAyat(data).subscribe(() => this.loadAyat());
          },
        },
      ],
    });

    await alert.present();
  }

  async editAyat(ayat: Ayat) {
    const alert = await this.alertController.create({
      header: 'Edit Kalimah / Ayat',
      cssClass: 'custom-alert-input',  // Applying custom CSS class
      inputs: [
        { name: 'melayu', type: 'text', value: ayat.melayu },
        { name: 'indonesia', type: 'text', value: ayat.indonesia },
        { name: 'english', type: 'text', value: ayat.english },
        { name: 'arabic_fusha', type: 'text', value: ayat.arabic_fusha },
        { name: 'arabic_ammiyah_jordan', type: 'text', value: ayat.arabic_ammiyah_jordan },
        { name: 'arabic_ammiyah_saudi', type: 'text', value: ayat.arabic_ammiyah_saudi },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            data.id = ayat.id;
            this.crudService.editAyat(data).subscribe(() => this.loadAyat());
          },
        },
      ],
    });

    await alert.present();
  }


  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteAyat(id);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteAyat(id: number) {
    this.crudService.deleteAyat(id).subscribe(() => this.loadAyat());
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadAyat();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadAyat();
    }
  }

  firstPage() {
    this.page = 1;
    this.loadAyat();
  }

  lastPage() {
    this.page = this.totalPages;
    this.loadAyat();
  }
}
