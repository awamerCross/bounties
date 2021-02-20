import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";

export const getOrderStore = (lang , provider_id , payment_type , lat , lng , coupon_number , notes , deliverd_time, address , token , props ,total) => {
    return (dispatch) => {

        axios({
            url         : CONST.url + 'orders/store',
            method      : 'POST',
            data        : { lang , provider_id , payment_type , lat , lng , coupon_number , notes , deliverd_time, address ,total},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getOrderStore', payload: response.data})
            if (response.data.key == 1){
                props.navigation.navigate('ConfirmUserPayment')
            }else{
                Toast.show({
                    text        	: response.data.msg,
                    type			: "danger",
                    duration    	: 3000,
                    textStyle   	: {
                        color       	: "white",
                        fontFamily  	: 'cairo',
                        textAlign   	: 'center'
                    }
                });
            }
        })

    }
};