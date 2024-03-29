import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, FlatList , Platform, I18nManager, ActivityIndicator} from "react-native";
import {Container, Content, Header, Button, Left, Body, Title, Icon,} from 'native-base'
import styles from '../../assets/style'
import {connect} from "react-redux";
import {NavigationEvents} from "react-navigation";
import { searchHome } from '../actions';
import i18n from "../../locale/i18n";
import ProductBlock from './ProductBlock'
import COLORS from "../consts/colors";

const isIOS = Platform.OS === 'ios';

class SearchHome extends Component {
    constructor(props){
        super(props);

        this.state={

        }
    }

    componentWillMount() {
        const data  = { keyword : this.props.navigation.state.params.categorySearch  , lang : this.props.lang , lat :  this.props.navigation.state.params.lat ,lng :  this.props.navigation.state.params.lng};
        this.props.searchHome(data , this.props.navigation.state.params.category_id , this.props.user.token);

    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={[styles.textRegular, styles.text_black, styles.textSize_18]}>{ i18n.t('home') }</Text> ) ,
        drawerIcon  : ( <Image style={[styles.smImage]} source={require('../../assets/images/home.png')} resizeMode={'cover'}/>)
    });

    _keyExtractor = (item, index) => item.id;

    renderItems = (item, key) => {
        return(
			<ProductBlock item={item} key={key} fromFav={false} navigation={this.props.navigation} />
        );
    };


    renderLoader(){
        if (this.props.loader){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    onFocus(){
        this.componentWillMount();
    }

    render() {

        return (
            <Container>

                { this.renderLoader() }

                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={[styles.leftIcon]}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            {this.props.navigation.state.params.categorySearch}
                        </Title>
                    </Body>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                <Content  contentContainerStyle={styles.bgFullWidth} style={styles.bgFullWidth}>

                            <View style={[styles.marginVertical_5 , styles.paddingHorizontal_5]}>
                                {
                                    this.props.categories?
                                        <FlatList
                                            data                    = {this.props.categories}
                                            renderItem              = {({item}) => this.renderItems(item)}
                                            numColumns              = {2}
                                            keyExtractor            = {this._keyExtractor}
                                            extraData               = {this.props.categories}
                                            onEndReachedThreshold   = {isIOS ? .01 : 1}
                                        />
                                        :
                                        <View/>
                                }


                            </View>

                </Content>
                </ImageBackground>
            </Container>

        );
    }
}

const mapStateToProps = ({ lang, home, searchHome , profile }) => {
    return {
        lang            : lang.lang,
        categories      : searchHome.categories,
        loader          : home.loader,
        user: profile.user,
    };
};
export default connect(mapStateToProps, { searchHome })(SearchHome);
