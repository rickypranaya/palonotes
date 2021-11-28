import {Dimensions, StatusBar} from 'react-native';

class Constant {
    static STATUSBAR_HEIGHT = StatusBar.currentHeight;
    static DEVICE_WIDTH = Dimensions.get('window').width;
    static DEVICE_HEIGHT = Dimensions.get('window').height;
    static PRIMARY_COLOR = '#05cc98';
    static SECONDARY_COLOR = '#F0FFFE';
    static LIGHT_GREY = '#D8D8D8';
    static TERTIARY_FONT_SIZE = 13;
    static TERTIARY_GREY_COLOR = '#999999';
}

export default Constant;
