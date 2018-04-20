import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { GuestPage } from '../guest/guest';
import { HostSongListPage } from "../host-song-list/host-song-list";
import { HowtoPage } from '../howto/howto';
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { SessionDataProvider } from "../../providers/session-data/session-data";
import {Observable} from "rxjs/Observable";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";

/**
 * Generated class for the HostGuestPage page. A user can select either 'host'
 * or 'guest'.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-host-guest',
  templateUrl: 'host-guest.html',
})
export class HostGuestPage {
  HostButton: any;
  GuestButton: any;
  HowtoButton: any;
  public id: string;
  roomList: AngularFireList<any>;
  rooms: Observable<any[]>;
  idList: Array<String>;
  found: number = -1;

  constructor(
    public navCtrl: NavController,
    public afDB: AngularFireDatabase,
    public alertCtrl: AlertController,
    public fBProvider: FirebaseProvider,
    private sDProvider: SessionDataProvider) {
      this.HostButton = HostSongListPage;
      this.GuestButton = GuestPage;
      this.HowtoButton = HowtoPage;
      this.roomList = this.afDB.list('/rooms');
      this.rooms = this.roomList.valueChanges();
      this.idList = new Array<String>(2);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HostGuestPage');
  }

  /**
   * Generate an alphanumeric string of length 5 to be used as a room code.
   * @returns {string}
   */
  makeId() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    //TODO: make the length a constant to avoid hardcoding
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  //TODO: Maybe swap makeId() and genCode() (as in their names).

  /**
   * Use the room code generated by makeId() to make a room in the Firebase and then takes
   * the user to the generated room.
   */
  makeRoomAndEnter() {
    this.id = this.makeId();
    this.fBProvider.genRoom(this.id);
    this.sDProvider.setRoomCode(this.id);
    this.sDProvider.setHost(true);
    // this.navCtrl.push(HostSongListPage, {roomId: this.id});
    //Set HostSongPage as root https://stackoverflow.com/questions/37296999/ionic-2-disabling-back-button-for-a-specific-view
    let alert = this.alertCtrl.create({
      title: 'Room Created',
      message: 'Your room code is "' +this.id+ '"',
      buttons: ["OK"]
    });
    alert.present();
    this.navCtrl.insert(0, HostSongListPage, {roomId: this.id}).then(() => {
      this.navCtrl.popToRoot();
    });
  }

}
