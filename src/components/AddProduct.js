import React, { Component } from "react";
import {View, Text, Image, ImageBackground , TouchableOpacity , KeyboardAvoidingView, ImageEditor, ImageStore, FlatList, I18nManager } from "react-native";
import {Container, Content, Icon, Header, Left, Button, Body, Title, Form, Item, Input, Textarea, Picker, Toast} from 'native-base'
import styles from '../../assets/style'
import i18n from '../../locale/i18n'
import * as Animatable from 'react-native-animatable';
import {connect} from "react-redux";
import {profile , addProduct, subCate , updateProduct, deleteProductImage} from '../actions';
import {NavigationEvents} from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';


 import {ImageBrowser,CameraBrowser} from 'expo-multiple-imagepicker';
import * as Permissions from 'expo-permissions';

let base64   = [];

class AddProduct extends Component {
    constructor(props){
        super(props);

        this.state={
            namePro		            : '',
            pricePro                : '',
            discount                : 0,
            time                    : '',
            info	                : '',
            kindPro	                : null,
            imageBrowserOpen        : false,
            cameraBrowserOpen       : false,
            photos                  : [],
            imageId                 : null,
            refreshed               : false,
            spinner                 : false,
        }
    }

    onValuekind      (value) {this.setState({kindPro: value});}

    validate = () => {

        let isError     = false;
        let msg         = '';

        if (this.state.namePro.length <= 0) {
            isError     = true;
            msg         = i18n.t('namepro');
        }else if (this.state.pricePro.length <= 0){
            isError     = true;
            msg         = i18n.t('monypro');
        }else if (this.state.info === ''){
            isError     = true;
            msg         = i18n.t('info');
        }else if (this.state.kindPro === null){
            isError     = true;
            msg         = i18n.t('kindpro');
        }else if (this.state.time === ''){
            isError     = true;
            msg         = i18n.t('time_end');
        }
        else if (this.state.photos.length <= 0){
            isError     = true;
            msg         = i18n.t('infoimage');
        }

        if (msg !== ''){
            Toast.show({
                text          : msg,
                duration      : 2000,
                type          : "danger",
                textStyle     : {
                    color           : "white",
                    fontFamily      : 'cairo',
                    textAlign       : 'center',
                }
            });
        }
        return isError;
    };

    async componentDidMount() {
        base64 = [];
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    }

    onAddproduct() {

        this.setState({ spinner: true });

        const err = this.validate();

        if (!err){

            const { namePro, pricePro, discount, info, kindPro , time } = this.state;
            const data = { namePro, pricePro, discount, info, kindPro ,time, base64};

            this.props.addProduct(data, this.props, this.props.lang, this.props.user.token);

        }else {

            this.setState({ spinner: false });

        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.product);
		this.setState({ spinner: false });

	}

	onChangeProudct(){

        this.setState({ spinner: true });

        const err = this.validate();

        if (!err){

            const { namePro, pricePro, discount, info, kindPro } = this.state;
            const data = { namePro, pricePro, discount, info, kindPro , base64};

            this.props.updateProduct(data, this.props, this.props.lang, this.props.user.token);
            this.setState({ spinner: false });

        }else {

            this.setState({ spinner: false });

        }

    }

    imgItems = (item, imageId) => {
        return(
            <View style={[ styles.flex_45, styles.position_R , styles.marginHorizontal_5, styles.marginVertical_10]}>
                <View style={[styles.lightOverlay, styles.Border , {top:-5 , left:-5}]}/>
                <TouchableOpacity
                    onPress     = {() => this.deleteImage(item)}
                    style       = {[styles.position_A , styles.bg_overlay, styles.Width_100, styles.heightFull, styles.flexCenter]}
                >
                    <Icon type={'EvilIcons'} name={'close'} style={[styles.text_darkblue, styles.textSize_20]} />
                </TouchableOpacity>
                <TouchableOpacity
                    style       = {[ styles.height_60 , styles.Width_100,  styles.Radius_5]}
                    onPress     = {() => this.selectImage(item.md5)}
                >
                    <Image
                        style   = {[ styles.height_60 , styles.Width_100 , styles.Radius_5]}
                        source  = {{uri: item}}
                    />
                </TouchableOpacity>
            </View>
        );
    }


    deleteImage(item){
        let index = this.state.photos.indexOf(item);
        let photos = this.state.photos;
        photos.splice(index, 1);
        base64.splice(index, 1);
        this.setState({ photos, refreshed: !this.state.refreshed, imageId: null })
    }


    imageBrowserCallback = (callback) => {
        callback.then((photos) => {
            let images = this.state.photos;
            this.setState({
                imageBrowserOpen: false,
                photos: images.concat(photos)
            });

            const imgs = this.state.photos;
            console.log(imgs);
            for (var i =0; i < imgs.length; i++){
                const imageURL = imgs[i].file;
                Image.getSize(imageURL, (width, height) => {
                    var imageSize = [{
                        resize: {
                            width,
                            height
                        }
                    }];

                    console.log('imgURI', imageURL);
                    ImageManipulator.manipulateAsync(imageURL, imageSize, { format: 'png', base64: true }).then(res => {
                       base64.push(res.base64);
                       console.log('res____', res)
                   });
                }, (reason) => console.log(reason))
            }
        }).catch((e) => console.log(e))
    };


    componentWillMount() {
		base64 = [];

		this.setState({ spinner: false });
        this.props.subCate( this.props.lang, this.props.user.token);

        if(this.props.navigation.state.params !== undefined){

            this.setState({
                namePro             : this.props.navigation.state.params.data.name,
                pricePro            : this.props.navigation.state.params.data.price.toString(),
                discount            : this.props.navigation.state.params.data.discount.toString(),
                info                : this.props.navigation.state.params.data.description,
                kindPro             : this.props.navigation.state.params.data.sub_category_id,
                photos              : this.props.navigation.state.params.data.images,
            });
        }
    }

    onFocus(){
		base64 = [];
        this.componentWillMount();
    }

   async getImages(){

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect    : [4, 3],
            base64    : true
        });

       if (!result.cancelled) {

           let photos = this.state.photos;
           photos.push(result.uri);

           this.setState({ photos });

           base64.push(result.base64);
       }
    }
    render() {
        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser base64={true} max={5} callback={this.imageBrowserCallback}/>);
        }else if (this.state.cameraBrowserOpen) {
            return(<CameraBrowser base64={true} max={5} callback={this.imageBrowserCallback}/>);
        }

        return (
            <Container>
                <Spinner visible = { this.state.spinner } />
                <NavigationEvents onWillFocus={() => this.onFocus()} />

                <Header style={styles.headerView}>
                    <Left style={styles.leftIcon}>
                        <Button style={styles.Button} transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon style={[styles.text_black, styles.textSize_22]} type="AntDesign" name='right' />
                        </Button>
                    </Left>
                    <Body style={styles.bodyText}>
                        <Title style={[styles.textRegular , styles.text_black, styles.textSize_20, styles.textLeft, styles.Width_100, styles.paddingHorizontal_0, styles.paddingVertical_0]}>
                            {i18n.t('addpro')}
                        </Title>
                    </Body>
                </Header>
                <ImageBackground source={I18nManager.isRTL ?require('../../assets/images/bg_img.png'):require('../../assets/images/bg_img2.png')} style={[styles.bgFullWidth]}>
                <Content contentContainerStyle={styles.bgFullWidth} style={styles.contentView}>

                        <View style={[styles.rowGroup, styles.marginVertical_10]}>
                            <View style={[styles.position_R, styles.flex_45,]}>
                                <View style={[styles.lightOverlay, styles.Border , styles.height_150 , {top:10 , left:10}]}/>
                                <View style={[styles.position_R, styles.Width_100, styles.overHidden, styles.bg_White, styles.height_150]}>
                                    <View style={[styles.lightOverlay, styles.Border, {top:0 , left:0}]}/>
                                    <Animatable.View animation="fadeInRight" easing="ease-out" delay={500} style={[styles.blockContent ,styles.bg_light_oran]}>
                                        <View style={[styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                            {/*<TouchableOpacity onPress={() => this.setState({imageBrowserOpen: true})}>*/}
                                            <TouchableOpacity onPress={() => this.getImages()}>
                                                <Icon style={[styles.text_darkblue , styles.textSize_20]} type="AntDesign" name='plus' />
                                            </TouchableOpacity>
                                        </View>
                                    </Animatable.View>
                                </View>
                            </View>
                            <View style={[styles.flex_45, {left : -10}]}>
                                <View style={[ styles.rowGroup ]}>
                                    <FlatList
                                        data            = {this.state.photos}
                                        renderItem      = {({item}) => this.imgItems(item, this.state.imageId)}
                                        numColumns      = {2}
                                        keyExtractor    = {this._keyExtractor}
                                        extraData       = {this.state.refreshed}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*<KeyboardAvoidingView behavior={'padding'} style={styles.keyboardAvoid}>*/}
                            <Form style={[styles.Width_100, styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter ]}>
                                    <Item floatingLabel style={[ styles.item, styles.position_R, styles.overHidden ]}>
                                        <Input
                                            placeholder             = {i18n.t('nameproducer')}
                                            style                   = {[ styles.input , styles.height_50 , styles.borderBlack, styles.paddingHorizontal_20]}
                                            onChangeText            = {(namePro) => this.setState({namePro})}
                                            value                   = {this.state.namePro}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.viewPiker, styles.flexCenter,styles.marginVertical_15,styles.Width_100, styles.borderBlack]}>
                                    <Item style={styles.itemPiker} regular>
                                        <Picker
                                            mode                    = "dropdown"
                                            style                   = {styles.Picker}
                                            placeholderStyle        = {[styles.textRegular,{ color: "#636363", writingDirection: 'rtl', width : '100%', fontSize : 14 }]}
                                            selectedValue           = {this.state.kindPro}
                                            onValueChange           = {this.onValuekind.bind(this)}
                                            textStyle               = {[styles.textRegular,{ color: "#636363", writingDirection: 'rtl', width : '100%', }]}
                                            placeholder             = {i18n.t('producer')}
                                            itemTextStyle           = {[styles.textRegular,{ color: "#636363", writingDirection: 'rtl', width : '100%', }]}
                                        >
                                            <Picker.Item style={[styles.Width_100]} label={i18n.t('producer')} value={null} />

                                            {
                                                this.props.subCategory.map((cate, i) => (
                                                    <Picker.Item style={styles.Width_100} key={i} label={cate.name} value={cate.id} />
                                                ))
                                            }

                                        </Picker>
                                    </Item>
                                    <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter ]}>
                                    <Item floatingLabel style={[ styles.item, styles.position_R, styles.overHidden ]}>
                                        <Input
                                            placeholder             = {i18n.t('monyproducer')}
                                            style                   = {[ styles.input , styles.height_50 , styles.borderBlack, styles.paddingHorizontal_20]}
                                            onChangeText            = {(pricePro) => this.setState({pricePro})}
                                            keyboardType            = {'number-pad'}
                                            value                   = {this.state.pricePro}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter ]}>
                                    <Item floatingLabel style={[ styles.item, styles.position_R, styles.overHidden ]}>
                                        <Input
                                            placeholder             = {i18n.t('sallproducer')}
                                            style                   = {[ styles.input , styles.height_50 , styles.borderBlack, styles.paddingHorizontal_20]}
                                            onChangeText            = {(discount) => this.setState({discount})}
                                            keyboardType            = {'number-pad'}
                                            value                   = {this.state.discount}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.height_70, styles.flexCenter ]}>
                                    <Item floatingLabel style={[ styles.item, styles.position_R, styles.overHidden ]}>
                                        <Input
                                            placeholder             = {i18n.t('time_end')}
                                            style                   = {[ styles.input , styles.height_50 , styles.borderBlack, styles.paddingHorizontal_20]}
                                            onChangeText            = {(time) => this.setState({time})}
                                            value                   = {this.state.time}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.overHidden, styles.flexCenter ]}>
                                    <Item style={[styles.item, styles.position_R, styles.overHidden]}>
                                        <Textarea
                                            auto-capitalization             = {false}
                                            rowSpan                         = {5}
                                            placeholder                     = {i18n.t('massprod')}
                                            style                           = {[ styles.textArea , styles.borderBlack, styles.paddingHorizontal_20]}
                                            onChangeText                    = {(info) => this.setState({info})}
                                            value                           = {this.state.info}
                                        />
                                    </Item>
                                </View>

                            </Form>

                            {
                                this.props.navigation.state.params !== undefined ?
                                    <TouchableOpacity
                                        onPress         = {() => this.onChangeProudct()}
                                        style           = {[styles.cartBtn , styles.SelfCenter , {marginBottom:20}]}
                                    >
                                        <Text style={[styles.textRegular, styles.text_White,styles.textSize_14, styles.textLeft ]} >
                                            {i18n.t('save')}
                                        </Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress         = {() => this.onAddproduct()}
                                        style           = {[styles.cartBtn , styles.SelfCenter , {marginBottom:20}]}
                                    >
                                        <Text style={[styles.textRegular, styles.text_White,styles.textSize_14, styles.textLeft ]} >
                                            {i18n.t('add')}
                                        </Text>
                                    </TouchableOpacity>
                            }

                        {/*</KeyboardAvoidingView>*/}
                </Content>
                    </ImageBackground>
            </Container>

        );
    }
}


const mapStateToProps = ({ lang, profile, subCate, addProduct }) => {
    return {
        lang                : lang.lang,
        user                : profile.user,
        subCategory         : subCate.subCate,
        product             : addProduct.product
    };
};
export default connect(mapStateToProps, {addProduct , profile, subCate , updateProduct, deleteProductImage})(AddProduct);
