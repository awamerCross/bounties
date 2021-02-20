import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground  , FlatList, Platform, I18nManager} from "react-native";
import { Icon } from 'native-base'
import styles from '../../assets/style'
import {connect} from "react-redux";
import i18n from "../../locale/i18n";
import { favorite } from '../actions';


class ProductBlock extends Component {
	constructor(props){
		super(props);

		this.state={
			count : 0,
			isFav: this.props.fromFav
		}
	}

	toggleFavorite (id){
		this.setState({ isFav: ! this.state.isFav });
		const token =  this.props.user ?  this.props.user.token : null;
		this.props.favorite( this.props.lang, id  , token );
	}


	componentWillReceiveProps(nextProps) {
		this.setState({ isFav: nextProps.item.is_fav == 1 ? true : false });
	}

	render() {

		console.log(this.state.isFav, this.props.item.id, this.props.item.is_fav);

		return (
			<TouchableOpacity
				style       = {[styles.position_R , styles.flex_45, styles.marginVertical_15, styles.height_200, styles.marginHorizontal_10]}
				onPress     = {() => this.props.navigation.navigate(this.props.user?'product':'Login', { id : this.props.item.id })}
			>
				<View style={[styles.lightOverlay, styles.Border]} />
				<View style={[styles.bg_White, styles.Border]}>
					<View style={[styles.rowGroup, styles.paddingHorizontal_5 , styles.paddingVertical_5]}>
						<View style={[styles.flex_100, styles.position_R]}>
							<Image style={[styles.Width_100 , styles.height_100, styles.flexCenter]} source={{ uri : this.props.item.thumbnail }} resizeMode={'cover'}/>
							{
                                this.props.item.discount > 0
								?
                                    <Text style={[styles.overlay_transBlue, styles.text_White, styles.textRegular, styles.position_A, styles.top_5, styles.left_0, styles.paddingHorizontal_5]}>
                                        { this.props.item.discount } %
                                    </Text>
								:null
							}
						</View>
					</View>
					<View style={[styles.overHidden, styles.paddingHorizontal_10, styles.marginVertical_5,]}>
						<Text style={[styles.text_gray, styles.textSize_14, styles.textRegular, styles.Width_100, styles.textLeft]} >
							{ this.props.item.name }
						</Text>
						<Text style={[styles.text_light_gray, styles.textSize_12, styles.textRegular, styles.Width_100, styles.textLeft]}>
							{ this.props.item.category } - { this.props.item.sub_category }
						</Text>
						<View style={[styles.rowGroup]}>

							<View >
								<Text style={[styles.text_fyrozy, styles.textSize_13, styles.textRegular,styles.textLeft, styles.borderText, styles.paddingHorizontal_5]}>
									{this.props.item.discount_price} {i18n.t('RS')}
								</Text>
								<Text style={[styles.textSize_13, styles.textRegular,styles.textLeft, styles.borderText, styles.paddingHorizontal_5, { textDecorationLine: 'line-through' }]}>
									{this.props.item.price} {i18n.t('RS')}
								</Text>
							</View>

							{
								this.props.user?
									<TouchableOpacity onPress = {() => this.toggleFavorite(this.props.item.id)}>
										<Text>
											<Icon style={[styles.text_red, styles.textSize_18]} type="AntDesign" name={this.state.isFav ? 'heart' : 'hearto'} />
										</Text>
									</TouchableOpacity>
									:
									null
							}
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const mapStateToProps = ({ lang, profile }) => {
	return {
		lang        : lang.lang,
		user		: profile.user,
	};
};
export default connect(mapStateToProps, { favorite })(ProductBlock);
