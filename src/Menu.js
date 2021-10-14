import isElectron from 'is-electron';
import React, {Component, useState} from 'react';
import request from "superagent";
import { Textfit } from 'react-textfit';


class onepage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        const self = this;


        fetch('https://monitors.viterbo.edu/scrape/' + this.props.data)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        request
            .get('https://monitors.viterbo.edu/statics/' + this.props.data)
            .then((res) => {
                this.setState({
                    data: res,
                    feed: 0,
                })
            })
            .catch(err => {
                // err.message, err.response
            });
    }

    renderFooter(){
        console.log("came here")
        return(
            <footer className="text-center text-white">
                <div className="container p-2">
                    <div className="row">
                        <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
                            <img
                                src="../media/vegitarian.png"
                                className="w-50"
                            />
                        </div>
                        <div className="col-lg-2 col-md-12 mb-4 mb-md-0">
                            <img
                                src="../media/vegan.png"
                                className="w-50"
                            />
                        </div>
                    </div>
                </div>
            </footer>
        );
    }




    render() {
        const vegan = '../media/veganicon.png';
        const vegi=  '../media/vegicon.png';
        const { error, isLoaded, items } = this.state;

        const name = this.props.data.split('.')[0].toUpperCase();

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className={'wait2'}>Loading...</div>;
        } else {
            return <div className={'container-fluid py-4'}>
                <div className="col-12">
                    <p className="subtitle fancy">
                        <span>{name}</span>
                    </p>
                <div className={'row'}>

                    <div className={"card-columns"}>
                {items.map(item => (
                    <div className={'card X vw-42'}>
                        <span className={'float-right font-weight-bold'}>{item.calories}</span>
                        <h3 className={'text-truncate'}>{item.title}</h3>
                        <p className={'small'}>{item.details}</p>
                            {item.isvegan =="true"
                                ? <div className={"font-weight-bold small ext"}><img src={vegan}/></div>
                                : <span/>
                            }
                            {item.isvegetarian == "true"
                                ? <div className={"font-weight-bold smal ext"} ><img src={vegi}/></div>
                                : <span/>
                            }
                    </div>
                ))}
            </div>
            </div>
            </div>
                {this.renderFooter()}
            </div>
        }
    }
}


export default onepage;


