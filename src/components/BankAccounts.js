import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    FlatList,
    I18nManager,
    Animated,

} from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Right} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import {connect} from "react-redux";
import COLORS from '../../src/consts/colors'
import { getBankAcoounts , deleteBankAcoounts } from '../actions'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import {NavigationEvents} from "react-navigation";
import axios from "axios";
import CONST from "../consts";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


class BankAccounts extends Component {
    constructor(props){
        super(props);

        this.state={
            status              : null,
            starCount           : 3,
            activeType          : 0,
            isFav               : false,
            refreshed           : false,
            loader              : true,
            amount              : 0,
        }
    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('bankAcc') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/coin.png')} resizeMode={'contain'}/>)
    });


    componentWillMount() {
        this.setState({loader: true});
        setTimeout(() => this.props.getBankAcoounts( this.props.lang , this.props.user.token ), 2000);
        axios({
            url         : CONST.url + 'settlements',
            method      : 'POST',
            headers     : { Authorization: this.props.user.token },
            data        : {  }
        }).then(response => {
            console.log('data ' ,  response.data.data );
            this.setState({amount : response.data.data})
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({loader: false});
    }

    deleteBank(bankId){
        this.props.deleteBankAcoounts( this.props.lang , bankId , this.props.user.token )
    }

    _keyExtractor = (item, index) => item.id;

    renderItems = (item , index) => {
        console.log(item);
        return(
            <View
                style={[styles.position_R, styles.flexCenter, styles.Width_95, styles.marginVertical_5]}
            >
                <View style={[styles.rowGroup, item.index % 2 === 0 ? styles.bg_darkBlue : styles.bg_fyrozy, styles.Border, styles.paddingVertical_25, styles.paddingHorizontal_10]}>

                    {/*<View style={[styles.flex_40 , {marginRight:5}]}>*/}
                    {/*    <Image style={{width:'100%' , height:70 }} source={item.item.image} resizeMode={'contain'}/>*/}
                    {/*</View>*/}
                    <View style={[styles.flex_100]}>

                        <TouchableOpacity
                            onPress         = {() => this.props.navigation.navigate('editBankAcc' , {id:item.item.id , bankName:item.item.bank_name , bankNum:item.item.account_number})}
                            style={{width:20 , height:20 , position:'absolute' , right:0 , top:-15 }}>
                            <Image style={{width:'100%' , height:'100%' }} source={require('../../assets/images/edit.png')} resizeMode={'contain'}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress         = {() => this.deleteBank(item.item.id)}
                            style={{width:20 , height:20 , position:'absolute' , right:0 , bottom:-15 }}>
                            <Image style={{width:'100%' , height:'100%' }} source={require('../../assets/images/trash.png')} resizeMode={'contain'}/>
                        </TouchableOpacity>

                        <View style={[styles.overHidden]}>
                            <Text style={[styles.text_White, styles.textSize_13, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                {i18n.t('bankName')} : {item.item.bank_name}
                            </Text>
                            <Text style={[styles.text_White, styles.textSize_13, styles.textRegular,styles.textLeft, styles.paddingHorizontal_5]}>
                                {i18n.t('bankNum')} : {item.item.account_number}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderNoData(){
        if (this.props.bankAcoounts && (this.props.bankAcoounts).length <= 0){
            return(
                <View style={[styles.directionColumnCenter , {height:'95%'}]}>
                    <Image source={require('../../assets/images/no-data.png')} resizeMode={'contain'} style={{ alignSelf: 'center', width: 200, height: 200 }} />
                </View>
            );
        }

        return <View />
    }

    componentDidMount() {
        this.runPlaceHolder();
    }

    runPlaceHolder() {
        if (Array.isArray(this.loadingAnimated) && this.loadingAnimated.length > 0) {
            Animated.parallel(
                this.loadingAnimated.map(animate => {
                    if (animate && animate.getAnimated) {
                        return animate.getAnimated();
                    }
                    return null;
                }),
                {
                    stopTogether: false,
                }
            ).start(() => {
                this.runPlaceHolder();
            })
        }
    }

    _renderRows(loadingAnimated, numberRow, uniqueKey) {
        let shimmerRows = [];
        for (let index = 0; index < numberRow; index++) {
            shimmerRows.push(
                <ShimmerPlaceHolder
                    key={`loading-${index}-${uniqueKey}`}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={{marginVertical:7, alignSelf: 'center'}}
                    width={width - 20}
                    height={100}
                    colorShimmer={['#ffffff75', COLORS.light_blue, '#ffffff75']}
                />
            )
        }

        return (
            <View >
                {shimmerRows}
            </View>
        )
    }

    onFocus() {
        this.componentWillMount();
    }
    render() {

        this.loadingAnimated = [];

        return (
            <Container>
                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>{i18n.t('bankAcc')}</Title>
                    </Body>
                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                    <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>
                        <NavigationEvents onWillFocus={() => this.onFocus()}/>
                        <View style={{flexDirection : 'row' ,justifyContent:'center',alignItems:'center' , borderWidth : .5 , borderColor : COLORS.fyrozy}}>
                            <Text style={{textAlign:'center' ,fontFamily : 'cairoBold' , marginVertical: 20,fontSize:20, color :COLORS.darkblue}}>{i18n.t('total_Amount')} </Text>
                                <Text> : </Text>
                            <Text  style={{textAlign:'center' ,fontFamily : 'cairoBold',fontSize:22, color :COLORS.red}}>{this.state.amount} {i18n.t('rs')} </Text>
                        </View>
                        <View style={[styles.paddingHorizontal_10]}>
                            {
                                this.state.loader ?
                                    this._renderRows(this.loadingAnimated, 5, '5rows') :
                                    <View>
                                        {/*{ this.renderNoData() }*/}
                                        {
                                            this.props.bankAcoounts?
                                                <FlatList
                                                    data={this.props.bankAcoounts}
                                                    renderItem={(item) => this.renderItems(item)}
                                                    numColumns={1}
                                                    keyExtractor={this._keyExtractor}
                                                />
                                                :<View/>
                                        }
                                        <TouchableOpacity
                                            style={[
                                                styles.bg_darkBlue,
                                                styles.width_150,
                                                styles.flexCenter,
                                                styles.marginVertical_25,
                                                styles.height_40
                                            ]}
                                            onPress={() => this.props.navigation.navigate('addBankAcc')}>
                                            <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                                {i18n.translate('addAcc')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                    </Content>
                </ImageBackground>
            </Container>

        );
    }
}


const mapStateToProps = ({ lang , bankAcoounts , profile}) => {
    return {
        lang                    : lang.lang,
        user                    : profile.user,
        bankAcoounts           : bankAcoounts.bankAcoounts,
    };
};
export default connect(mapStateToProps, {getBankAcoounts , deleteBankAcoounts})(BankAccounts);
