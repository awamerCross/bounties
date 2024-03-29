import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, ActivityIndicator, I18nManager} from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Left,
    Icon,
    Body,
    Title,
    Item,
    Input,
    Picker,
    CheckBox,
    Form, Right,
} from 'native-base'
import styles from '../../assets/style'
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import i18n from "../../locale/i18n";
import * as Animatable from "react-native-animatable";
import {getOrderStore , bookPackage , bookLoginPackage} from '../actions'
import COLORS from "../consts/colors";

class FormPayment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            accNum: '',
            finishDate: '',
            confirmCode: '',
            usernameStatus: 0,
            accNumStatus: 0,
            finishDateStatus: 0,
            confirmCodeStatus: 0,
            isSubmitted: false,
        }
    }


    renderStoreOrder(){
        if (this.state.isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginVertical_15]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            )
        }
        const isSubscription = this.props.navigation.state.params.routeName ==='subscription' || this.props.navigation.state.params.routeName ==='subscriptionsPackages' ;

        return (
            <TouchableOpacity
                onPress={() =>isSubscription ? this.navigateScreen() : this.storeOrder()}
                style={[styles.bg_darkBlue,
                    styles.width_150,
                    styles.flexCenter,
                    styles.marginVertical_15,
                    styles.height_40]}>
                <Text
                    style={[styles.textRegular, styles.text_White, styles.textSize_14, styles.textLeft]}>{i18n.t('confirm')}</Text>
            </TouchableOpacity>
        );
    }

    navigateScreen(){

        if(this.props.navigation.state.params.routeName ==='subscriptionsPackages'){
            this.setState({ isSubmitted: true });
            this.props.bookPackage(this.props.lang, this.props.navigation.state.params.id , this.props.navigation.state.params.product_id , this.props.user.token  , this.props )

        }
        if(this.props.navigation.state.params.routeName ==='subscription'){
            this.setState({ isSubmitted: true });
            this.props.bookLoginPackage(this.props.lang, this.props.navigation.state.params.packageId , this.props.navigation.state.params.user_id  , this.props , this.props.user.token )

        }

        // this.props.navigation.navigate(this.props.navigation.state.params.routeName ==='subscription'?'drawerNavigator' : 'ConfirmPayment')
    }

    storeOrder(){
        this.setState({ isSubmitted: true });

        const provider_id             = this.props.navigation.state.params.provider_id;
        const shipping_price          = this.props.navigation.state.params.shipping_price;
        const address                 = this.props.navigation.state.params.address;
        const lat                     = this.props.navigation.state.params.latitude;
        const lng                     = this.props.navigation.state.params.longitude;
        const payment_type            = this.props.navigation.state.params.payment_type;
        const deliverd_time           = this.props.navigation.state.params.deliverd_time;
        const notes                   = this.props.navigation.state.params.notes;
        const coupon_number           = this.props.navigation.state.params.coupon_number;


        this.props.getOrderStore(this.props.lang, provider_id , payment_type , lat , lng , coupon_number , notes , deliverd_time , address , this.props.user.token  , this.props )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ isSubmitted: false});
        // this.props.navigation.navigate(nextProps.navigation.state.params.routeName ==='subscription' || nextProps.navigation.state.params.routeName ==='subscriptionsPackages'?'drawerNavigator' : 'ConfirmPayment')

    }


    activeInput(type) {
        if (type === 'username' || this.state.username !== '') {
            this.setState({usernameStatus: 1})
        }

        if (type === 'accNum' || this.state.accNum !== '') {
            this.setState({accNumStatus: 1})
        }

        if (type === 'finishDate' || this.state.finishDate !== '') {
            this.setState({finishDateStatus: 1})
        }

        if (type === 'confirmCode' || this.state.confirmCode !== '') {
            this.setState({confirmCodeStatus: 1})
        }
    }

    unActiveInput(type) {
        if (type === 'username' && this.state.username === '') {
            this.setState({usernameStatus: 0})
        }

        if (type === 'accNum' && this.state.accNum === '') {
            this.setState({accNumStatus: 0})
        }

        if (type === 'finishDate' && this.state.finishDate === '') {
            this.setState({finishDateStatus: 0})
        }

        if (type === 'confirmCode' && this.state.confirmCode === '') {
            this.setState({confirmCodeStatus: 0})
        }

    }


    componentWillMount() {
    }


    renderLoader() {
        if (this.props.loader) {
            return (
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    onFocus() {
        this.componentWillMount();
    }

    render() {

        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()}/>

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right'/>
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                    <Title
                        style={[styles.textRegular, styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                        {i18n.t('pay')}
                    </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                <Content contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>

                        <View style={[styles.overHidden]}>
                            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}
                                             style={[styles.flexCenter]}>
                                <Image
                                    style={[styles.upImage, styles.flexCenter]}
                                    source={require('../../assets/images/payment.png')}
                                />
                            </Animatable.View>
                        </View>
                        <KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>
                            <Form
                                style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>


                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.t('userName')}
                                            style={[styles.input, styles.height_50, (this.state.usernameStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(username) => this.setState({username})}
                                            onBlur={() => this.unActiveInput('username')}
                                            onFocus={() => this.activeInput('username')}
                                        />
                                    </Item>
                                    <View
                                        style={[styles.position_A, styles.bg_light_oran, styles.flexCenter, styles.iconInput, (this.state.usernameStatus === 1 ? styles.left_0 : styles.leftHidLeft)]}>
                                        <Icon style={[styles.text_blue, styles.textSize_22]} type="AntDesign"
                                              name='user'/>
                                    </View>
                                </View>

                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('idNum')}
                                            style={[styles.input, styles.height_50, (this.state.accNumStatus === 1 ? styles.Active : styles.noActive)]}
                                            keyboardType={'number-pad'}
                                            onChangeText={(accNum) => this.setState({accNum})}
                                            onBlur={() => this.unActiveInput('accNum')}
                                            onFocus={() => this.activeInput('accNum')}
                                        />
                                    </Item>
                                    <View
                                        style={[styles.position_A, styles.bg_light_oran, styles.flexCenter, styles.iconInput, (this.state.accNumStatus === 1 ? styles.left_0 : styles.leftHidLeft)]}>
                                        <Icon style={[styles.text_blue, styles.textSize_22]} type="MaterialCommunityIcons"
                                              name='account-details'/>
                                    </View>
                                </View>

                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('finishDate')}
                                            style={[styles.input, styles.height_50, (this.state.finishDateStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(finishDate) => this.setState({finishDate})}
                                            onBlur={() => this.unActiveInput('finishDate')}
                                            onFocus={() => this.activeInput('finishDate')}
                                        />
                                    </Item>
                                    <View
                                        style={[styles.position_A, styles.bg_light_oran, styles.flexCenter, styles.iconInput, (this.state.finishDateStatus === 1 ? styles.left_0 : styles.leftHidLeft)]}>
                                        <Icon style={[styles.text_blue, styles.textSize_22]} type="MaterialIcons"
                                              name='date-range'/>
                                    </View>
                                </View>

                                <View
                                    style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Input
                                            placeholder={i18n.translate('confirmCode')}
                                            style={[styles.input, styles.height_50, (this.state.confirmCodeStatus === 1 ? styles.Active : styles.noActive)]}
                                            keyboardType={'number-pad'}
                                            onChangeText={(confirmCode) => this.setState({confirmCode})}
                                            onBlur={() => this.unActiveInput('confirmCode')}
                                            onFocus={() => this.activeInput('confirmCode')}
                                        />
                                    </Item>
                                    <View
                                        style={[styles.position_A, styles.bg_light_oran, styles.flexCenter, styles.iconInput, (this.state.confirmCodeStatus === 1 ? styles.left_0 : styles.leftHidLeft)]}>
                                        <Icon style={[styles.text_blue, styles.textSize_22]} type="MaterialIcons"
                                              name='confirmation-number'/>
                                    </View>
                                </View>

                                {
                                    this.renderStoreOrder()
                                }

                            </Form>
                        </KeyboardAvoidingView>

                </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({lang , profile}) => {
    return {
        lang: lang.lang,
        user: profile.user,
    };
};
export default connect(mapStateToProps, {getOrderStore , bookPackage , bookLoginPackage})(FormPayment);