import React, { Component } from 'react';
import request from "superagent";



class SlideShow extends Component {

    constructor(props, context) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.interval = null;

    }

    componentDidMount() {
        this.interval = setInterval(this.transitionToNextSlide.bind(this), 3400);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    transitionToNextSlide() {
        this.setState({slideIndex: (this.state.slideIndex + 1) % this.props.slides.length})
        request
            .get('https://monitors.viterbo.edu/alerts/reportslide.php?monitor=' + this.props.monitor +  "&slide=" + this.state.slideIndex)
            .then((res) => {

            })
            .catch(err => {
                // err.message, err.response
            });

        //console.log('https://monitors.viterbo.edu/alerts/reportslide.php?monitor=' + monitor  + "&slide=" + currentSlide)

    }


        render()
        {
            let containerStyle = {
                width: '100%'
            };

            return (
                <div style={containerStyle}>
                    <Slide slide={this.props.slides[this.state.slideIndex]}/>
                </div>
            );
        }

}

export default SlideShow;




class Slide extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="ggg">
                <img src={'https://www.viterbo.edu' + this.props.slide.field_scroller_image} alt={this.props.imageAlt} />

            </div>
        );
    }
}




