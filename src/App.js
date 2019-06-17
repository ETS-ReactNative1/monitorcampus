import React, { Component } from 'react';
import request from 'superagent';
import logo from './logo-red.svg';
import './App.css';
import Slider from "react-slick";  //slider library loaded via npm
import Sound from 'react-sound';  //sound library loaded via npm
import { BrowserRouter as Router, Route } from 'react-router-dom'
import $ from 'jquery';

//centering inline css for slide
let fillimg = {
  width:'90vw',
  height:'80vh'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    }
    //http://viterbouniveristyd8dev.prod.acquia-sites.com/
    this.server_name="https://www4.viterbo.edu/";
    var urlParams = new URLSearchParams(window.location.search);
    this.monitor = urlParams.get('monitor');
    this.padtop = urlParams.get('pad');
    console.log(this.monitor); // ["name"]
    this.fetchPhotos = this.fetchPhotos.bind(this)  //needed for reference below
    this.checkAlert = this.checkAlert.bind(this)  //needed for reference below
    this.reportStatus = this.reportStatus.bind(this)  //needed for reference below
    this.isAlert=false;
  }

  componentDidMount() {
    this.fetchPhotos();
    var intervalId = setInterval((this.fetchPhotos), 180000); // 3 minutes in milliseconds
    var intervalId2 = setInterval((this.checkAlert),  8000); // 8 seconds
    var intervalId3 = setInterval((this.reportStatus),  35000); // 25 seconds
  }

  fetchPhotos() {  //call api from drupal to get slides, stores in photos
    var randomstring = require("randomstring");
    randomstring.generate(7);
    request
        .get(this.server_name + this.monitor +'?'+ randomstring.generate(4))
        .then((res) => {
      this.setState({
      photos: res.body
    })
  })
  }
  reportStatus() {  //call api from drupal to get slides, stores in photos
    var url = new URL(window.location.href);
    var monitor = url.searchParams.get("monitor");
    var curr = $('.slick-track').children('.slick-slide').css('opacity','1');
    request
        .get('http://libservices.viterbo.edu/al/alerts/reportstatus.php?monitor='+ monitor)
        .then((res) => {
          console.log('res');
        })
  }
  checkAlert() {  //checks libservices for alert json string to see if active
    request
          .get('http://libservices.viterbo.edu/al/alerts/site.php')
          .then((res) => {
        var rslts = JSON.parse(res.text)
        if (rslts.status === true){ ///las
        console.log('alert');
        this.isAlert=true;
        var msg = rslts.message;
        this.server_name="http://libservices.viterbo.edu/al/alerts/";
        var alert ={title: "alert",body: msg, nid:"001",field_event_image:"attention-clipart.jpg",field_location_name:"Notice",type:"Alert"};
        //var newPlayer = Object.assign({}, player, {score: 2});
        var newArray= [];
        newArray.push(alert);
        this.setState({
          photos: newArray
        })
      }
    else{
        this.isAlert=false;
        if(this.isAlert==true){
          this.isAlert=false;
          console.log('no alert');
          window.location.reload();
        }
          this.isAlert=false;
          console.log('no alert');
        }
    })
  }

  render() {
    const tpad = this.padtop;
    const isAlert = this.isAlert;
    const sound = isAlert ? ( //if alert play sound
    <Sound
        url="/alarm.wav"
    playStatus={Sound.status.PLAYING}
    playFromPosition={0 /* in milliseconds */}
    onLoading={this.handleSongLoading}
    onPlaying={this.handleSongPlaying}
    onFinishedPlaying={this.handleSongFinishedPlaying}
  />
  ) : (
    <nosound/>
  );
   // var speed=11000; //set speed based on variable hardcoded now
   /* if (this.state.photos.length>0){
      speed=this.state.photos[0].Speed;
    }*/
    var settings = {
      dots: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 1000,
      fade: true,
      autoplaySpeed: 12000,
      cssEase: "linear",
      arrows: false,
    };
    var outerClass = 'outer' + ' '  + this.monitor;


    return ( //here is the content

        <div className="App">
        <header className="App-header"  style={{ padding: tpad+"px"}}>
        <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className={outerClass}>
        {sound}
        <Slider {...settings}>
          {this.state.photos.map((photo, key) => { //loop through photos to output each photo inside slider widget
            return (
                <div key={photo.nid} className="slide-outer">
                  {console.log(photo)}
                  <div className="slide-container">
                    {photo.type === 'Event' ? ( //differnt content depending on type
                        <div className="inner-slide event">
                          <h1 >{photo.title}</h1>
                          <img className="scroll-img evt-img" src= {this.server_name + photo.field_event_image}/>
                          <h2><i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;{photo.field_event_date}</h2>
                          <h2><i className="fa fa-location-arrow" aria-hidden="true"></i>&nbsp;{photo.field_location_name}</h2>
                          <p>{photo.body}</p>
                        </div>
                    ):photo.type === 'Scrolling Image' ?(//image type
                        <div className="inner-slide photo">
                          <img className="scroll-img" style={fillimg} src= {this.server_name + photo.field_scroller_image}/>
                        </div>
                    ): (// alert
                        <div className="inner-slide event">
                          <h1 >{photo.title}</h1>
                          <img className="scroll-img evt-img" src= {this.server_name + photo.field_event_image}/>
                          <h2>{photo.body}</h2>
                        </div>
                    )}
                  </div>
                </div>
            )
          })}
        </Slider>
      </div>
      </div>
      );
  }
}

export default App;