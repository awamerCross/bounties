import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground  , FlatList, Platform, I18nManager, ActivityIndicator} from "react-native";
import {Container, Content, Header, Button, Left, Icon, Body, Title, Right} from 'native-base'
import styles from '../../assets/style'
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import i18n from "../../locale/i18n";
import { offers, favorite } from '../actions';
import RowProduct from './RowProduct'
import COLORS from "../consts/colors";

const isIOS = Platform.OS === 'ios';


class Offers extends Component {
    constructor(props){
        super(props);

        this.state={
            count       : 0
        }
    }

    componentWillMount() {
        this.props.offers( this.props.lang, this.props.user.token );
    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('offers') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/offers.png')}/>)
    });

    renderLoader(){
        if (this.props.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    _keyExtractor = (item, index) => item.id;

    renderItems = (item, key) => {
        return(
			<RowProduct item={item} key={key} fromFav={false} navigation={this.props.navigation} />
        );
    };

    onFocus(){
        this.componentWillMount();
    }

    render() {

        return (
            <Container>

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            { i18n.t('offers') }
                        </Title>
                    </Body>

                    <Right style={styles.rightIcon}>
                        <Image style={[styles.smallLogo , styles.marginHorizontal_10 , {top:0}]} source={require('../../assets/images/small_logo.png')} resizeMode={'contain'}/>
                    </Right>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                <Content  contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>
                    { this.renderLoader() }

                        <View style={[styles.marginVertical_5 , styles.paddingHorizontal_5]}>

                                <FlatList
                                    data                    = {this.props.offer}
                                    renderItem              = {({item}) => this.renderItems(item)}
                                    numColumns              = {1}
                                    keyExtractor            = {this._keyExtractor}
                                    // extraData               = {this.props.categoryProviders}
                                    onEndReachedThreshold   = {isIOS ? .01 : 1}
                                />

                        </View>

                </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({ lang, offers, profile }) => {
    return {
        lang        : lang.lang,
        offer       : offers.offers,
        user        : profile.user
    };
};
export default connect(mapStateToProps, { offers , favorite})(Offers);
