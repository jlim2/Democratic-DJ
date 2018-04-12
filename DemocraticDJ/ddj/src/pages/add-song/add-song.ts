import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { GuestSongListPage } from '../guest-song-list/guest-song-list';
import { HostSongListPage} from '../host-song-list/host-song-list';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { Song } from "../../interfaces/song";
import { SessionDataProvider } from "../../providers/session-data/session-data";

/**
 * Generated class for the AddSongPage page. An user can add a song to the
 * hostsonglist and guestsonglist.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-song',
  templateUrl: 'add-song.html',
})
export class AddSongPage {
  GuestSongListButton : any;
  HostSongListButton : any;

  // songList: AngularFireList<any>;
  roomId : string;
  title: string;
  searchResults:any[];

  // roomCode : String;
  //songList : AngularFireList<any>
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fBProvider: FirebaseProvider,
              private sDProvider: SessionDataProvider) {

    this.GuestSongListButton = GuestSongListPage;
    this.HostSongListButton = HostSongListPage;

    this.roomId = this.sDProvider.getRoomCode();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSongPage');
    console.log('Add Song Room: ' + this.roomId); // DEBUG
  }


  /**
   * Adds the song the user input to the Firebase under the specific room
   * where the user is located.
   * @param songInput - user input of the song name
   */
  addSongToFB(songInput) {
    console.log("songName: " + songInput + ", and roomCode: " +this.roomId); // DEBUG
    let song: Song = {title: songInput, upVotes: 0, downVotes: 0}; // converts the song to a Song object
    this.fBProvider.pushSong(song, this.roomId); // pushes the song to the Firebase
    console.log("fbkey "+ song.fbKey);
  }

  /**
   * If host, go to host song list page, otherwise GuestSongListPage
   */
  goToSongListPage(){
    console.log("Trying to go to Song List page with "+this.roomId);
    if (this.sDProvider.isHost() == true) {
      this.navCtrl.insert(0, HostSongListPage, {roomId: this.roomId}).then(() => {
        this.navCtrl.popToRoot();
      });
    } else {
      this.navCtrl.insert(0, GuestSongListPage, {roomId: this.roomId}).then(() => {
        this.navCtrl.popToRoot();
      });
    }
  }

  searchSpotify(event:any) {
    let searchTerm = event.target.value;
    console.log(searchTerm);
    this.sDProvider.searchSpotify(searchTerm).subscribe(
      data=>{
        //this.searchResults=data.artists.items;
        console.log(this.searchResults);
      },
      error=>{
        console.log(error);
      }
    )
  }



  // getSong() {
  //   this.songName = document.getElementsByName('songName').item;
  //   return this.songName;
  //
  // }

}
