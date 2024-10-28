import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Filesystem, Directory, FileInfo, StatResult } from '@capacitor/filesystem';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
// import { StorageService } from '../services/storage.service';
import { AlertController } from '@ionic/angular'; // Import AlertController
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ayatopen',
  templateUrl: './ayatopen.page.html',
  styleUrls: ['./ayatopen.page.scss'],
})
export class AyatOpenPage implements OnInit {

  ayatData: any;
  recording = false;
  // storedFileNames: FileInfo[] = []; // Explicitly define the type as FileInfo[]
  isRecording: boolean = false;  // Track recording state
  name: string = ''; // Declare the text property
  durationDisplay = '';
  duration = 0;
  caption_wav: string = '';

  inputs: string[] = ['', '', '', '']; // Array to hold four input values
  items: { key: string; value: string[] }[] = []; // Array of stored items
  voice: { key: string; value: string[] }[] = []; // Array of stored items

  constructor(
    private navCtrl: NavController,
    // private storageService: StorageService,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (history.state.ayatData) {
        this.ayatData = history.state.ayatData;
      }
    });
  }


  async presentAlert(alt: string, msg: string) {
    const alert = await this.alertController.create({
      header: alt,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  goBackWithParams() {
    const id = this.ayatData.id;
    const caption = this.ayatData.caption;
    const langguage_wav = this.ayatData.langguage_wav;

    // Navigate back with parameters
    this.navCtrl.navigateBack(`/ayat`, {
      queryParams: {
        id,
        caption,
        langguage_wav
      }
    });
  }

  async ngOnInit() {
    // await this.loadItems(); // Load items on component initialization

    this.name = '';  // Reset the name immediately after uploading
    // this.loadFiles(); // Corrected method name
    VoiceRecorder.requestAudioRecordingPermission();
    this.isRecording = false;
  }

  async confirmRecording() {
    const ay = this.ayatData.langguage_wav
    ? 'Are you sure you want to start new recording and replace the old one?'
    : 'Are you sure you want to start new recording?';

    const alert = await this.alertController.create({
      header: 'Confirm Recording',
      message: ay,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Recording cancelled');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.startRecording();
          },
        },
      ],
    });

    await alert.present();
  }

  startRecording(){
    if (this.recording){
      return;
    }
    this.name = '';  // Reset the name before setting a new one
    // this.name = name;
    // Prevent "profileInstalled" as a filename
    if (this.name === 'profileInstalled') {
      console.warn('Invalid filename: profileInstalled. Using default name.');
      // this.name = this.ayatData.id + '_' + this.ayatData.langguage_wav + '.wav';
    }

    this.isRecording = true;
    this.recording = true;
    console.log("recording");
    VoiceRecorder.startRecording();
    this.calculateDuration();
  }

  calculateDuration(){
    if (!this.recording){
      this.duration =0;
      this.durationDisplay='';
      return;
    }

    this.duration +=1;
    const minutes = Math.floor(this.duration / 60);
    const seconds = (this.duration % 60).toString().padStart(2, '0');
    this.durationDisplay = `${minutes}:${seconds}`;

    setTimeout(() => {
      this.calculateDuration();
    }, 1000);

  }

  async deleteRecording(fileName: string){
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: fileName
    });
    // this.loadFiles();
  }


async stopRecording() {
  if (!this.recording) {
    this.presentAlert("Error stopRecording",'Error recording running');
    return;
  }

  try {
    const result = await VoiceRecorder.stopRecording();

    if (result.value && result.value.recordDataBase64) {
      const recordData = result.value.recordDataBase64;

      if (!this.name) {
        this.name = this.ayatData.id + '_' + this.ayatData.caption.toLowerCase().replace(/ /g, '_') + '_' + new Date().getTime() + '.wav';
      }

      // Save the recording to the filesystem
      if (recordData !== null) {
        await this.uploadFile(this.name, recordData);
        // await Filesystem.writeFile({
        //   path: this.name,
        //   directory: Directory.Data,
        //   data: recordData,
        // });

        console.log(`${this.name} saved successfully.`);
        this.presentAlert("Recording",`Audio of '${this.ayatData.langguage}' was saved and upload successfully.`);
      } else {
        console.log('Skipped writing, name is profileInstalled.');
        this.presentAlert("Error stopRecording",'Skipped writing, name is profileInstalled.');
      }

      // this.loadFiles();
      this.recording = false;
      this.isRecording = false;

      // After saving the file, make the POST request
      // await this.uploadFile(this.name, recordData);

      // Reset the name field
      this.name = '';
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
    this.presentAlert("Error stopRecording",'Error stopping recording:' + error);
  }
}

// async loadFiles() {

//   try {
//     // Get the list of file names in the directory
//     const result = await Filesystem.readdir({
//       path: '',
//       directory: Directory.Data
//     });

//     const filesWithStats = await Promise.all(
//       result.files
//         .filter((file: FileInfo) => file.name !== 'profileInstalled') // Access name property
//         .map(async (file) => {
//           const fileStat = await Filesystem.stat({
//             path: file.name,
//             directory: Directory.Data,
//           });

//           return {
//             name: file,
//             modified: fileStat.mtime, // Modification time in epoch milliseconds
//           };
//         })
//     );

//     // Sort files by modification time (newest first)
//     filesWithStats.sort((a, b) => b.modified - a.modified);

//     // Store only the sorted file names
//     this.storedFileNames = filesWithStats.map(file => file.name);

//     console.log(this.storedFileNames); // Verify the sorted file names
//   } catch (error) {
//     console.error('Error reading files:', error);
//   }
// }

// async playFile(fileName: string){
//   const audioFile = await Filesystem.readFile({
//     path: fileName,
//     directory: Directory.Data
//   });
//   const base64Sound = audioFile.data;
//   const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
//   audioRef.oncanplaythrough = () => audioRef.play();
//   audioRef.load();

// }

async playWavUrl(url: string) {
  const response = await fetch(url);
  const audioBlob = await response.blob();
  const audioRef = new Audio(URL.createObjectURL(audioBlob));
  audioRef.oncanplaythrough = () => audioRef.play();
  audioRef.load();
}

// async playWavUrl(url: string) {
//   const audioRef = new Audio(url);
//   audioRef.oncanplaythrough = () => audioRef.play();
//   audioRef.load();
// }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  // Load all items from storage
  // async loadItems() {
  //   this.items = await this.storageService.getAllItems();
  // }

  // // Delete a specific item from storage
  // async deleteItem(key: string) {
  //   await this.storageService.deleteItem(key);
  //   await this.loadItems();
  // }

  // async clearStorage() {
  //   await this.storageService.clearAll();
  //   this.items = [];
  //   console.log('Storage cleared!');
  // }

  async uploadFile(filename: string, base64Data: string) {

    console.log("Caption "+ this.ayatData.caption);
    switch (this.ayatData.caption.toLowerCase().replace(/ /g, '_')) {
      case 'bahasa_melayu':
        this.caption_wav = 'melayu_wav';
        break;
      case 'bahasa_indonesia':
        this.caption_wav = 'indonesia_wav';
        break;
      case 'english':
        this.caption_wav = 'english_wav';
        break;
      case 'arabic_fusha':
        this.caption_wav = 'arabic_fusha_wav';
        break;
      case 'arabic_ammiyah_jordan':
        this.caption_wav = 'arabic_ammiyah_jordan_wav';
        break;
        case 'arabic_ammiyah_saudi':
          this.caption_wav = 'arabic_ammiyah_saudi_wav';
        break;
    }
    console.log("langguage_wav " + this.ayatData.langguage_wav);
    console.log("caption_wav " + this.caption_wav + ' ID '+ this.ayatData.id + ' filename ' + filename);

    const url = 'https://dividen.cbp.com.my/dev/ta/fileUpload.php'; // Replace with your actual endpoint

    // Prepare form data for the POST request
    const formData = new FormData();
    const blob = this.base64ToBlob(base64Data, 'audio/wav'); // Convert base64 to Blob
    formData.append('file', blob, filename);
    formData.append('filename', filename);
    formData.append('id', this.ayatData.id);
    formData.append('caption', this.caption_wav);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        this.ayatData.langguage_wav = filename;
        // this.ayatData = { ...this.ayatData, caption_wav: this.caption_wav };
        // Object.assign(this.ayatData, { caption_wav: this.caption_wav });

        console.log('File uploaded successfully');
      } else {
        console.error('Failed to upload file:', response.statusText);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  }

  // Utility function to convert Base64 to Blob
base64ToBlob(base64Data: string, contentType: string): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

getFontSize(caption: string): string {
  if (caption === 'Bahasa Melayu' || caption === 'English') {
    return '25px';
  } else {
    return '30px';
  }
}
}
