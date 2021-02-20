import React, { Component } from "react";
import {View, Text, Image, ImageBackground, ActivityIndicator, I18nManager, TouchableOpacity} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Right, Toast} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {connect} from "react-redux";
import { getAboutApp } from '../actions'
import * as Animatable from 'react-native-animatable';
import COLORS from "../consts/colors";
import axios from "axios";
import CONST from "../consts";
import {  profile} from "../actions";

class Wallet extends Component {
    constructor(props){
        super(props);

        this.state={
            status              : null,
            wallet              : 0,
        }
    }

    componentWillMount() {
        this.props.getAboutApp( this.props.lang )
        axios({
            url         :  CONST.url + 'wallet',
            method: 'POST',
            headers: {Authorization: this.props.user.token}
        }).then(response => {
          if(response.data.key == 0){
              Toast.show({
                  text: response.data.msg,
                  type:  "danger",
                  duration : 3000,
                  textStyle: {
                      color       : "white",
                      fontFamily  : 'cairo',
                      textAlign   : 'center',
                  }

              });
          }else{
           this.setState({wallet:response.data.msg})
          }
        })
    }

    renderLoader(){
        if (this.props.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('my_Wallet') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/wallet.png')}/>)
    });

    render() {

        return (
            <Container>
                { this.renderLoader() }
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                    <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                        { i18n.t('my_Wallet') }
                    </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>
                        <View style={[styles.position_R, styles.bgFullWidth, styles.Width_90, styles.marginVertical_15, styles.SelfCenter]}>
                            <View style={[styles.lightOverlay, styles.Border]}></View>
                            <View style={[styles.position_R, styles.Width_100, styles.overHidden, styles.bg_White, styles.Border,styles.bgFullWidth,]}>
                                <Animatable.View animation="fadeInDown" easing="ease-out" delay={500} style={[styles.flexCenter]}>
                                    <Image style={[styles.icoImage]} source={require('../../assets/images/logo.png')}/>
                                </Animatable.View>
                                <View style={[styles.overHidden]}>
                                  <Text style={[styles.textRegular,styles.text_darkblue,styles.textCenter,styles.marginVertical_25,{fontSize: 40}]}>{this.state.wallet}  ر.س  </Text>
                                  <Text style={[styles.text_gray,styles.textCenter,styles.marginVertical_5,{fontSize: 20} ,styles.textRegular]}>{i18n.t('money_in')}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={()=> { this.refundRequest()}}
                                    style={[
                                        styles.bg_darkBlue,
                                        styles.width_150,
                                        styles.flexCenter,
                                        styles.marginVertical_15,
                                        styles.height_40,
                                        {
                                            backgroundColor:'#133D54'
                                        }
                                    ]}>
                                    <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                        {i18n.translate('refund')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }

    refundRequest(){

        axios({
            url         :  CONST.url + 'refundRequest',
            method: 'POST',
            headers: {Authorization: this.props.user.token}
        }).then(response => {
            if(response.data.key == 0){
                Toast.show({
                    text: response.data.msg,
                    type:  "danger",
                    duration : 3000,
                    textStyle: {
                        color       : "white",
                        fontFamily  : 'cairo',
                        textAlign   : 'center',
                    }

                });
            }else{
                Toast.show({
                    text: response.data.msg,
                    type:  "success",
                    duration : 3000,
                    textStyle: {
                        color       : "white",
                        fontFamily  : 'cairo',
                        textAlign   : 'center',
                    }

                });
            }
        })
    }
}

const mapStateToProps = ({ lang, aboutApp ,profile}) => {
    return {
        lang        : lang.lang,
        aboutApp    : aboutApp.aboutApp,
        loader      : aboutApp.loader,
        user		: profile.user,
    };
};
export default connect(mapStateToProps, { getAboutApp })(Wallet);