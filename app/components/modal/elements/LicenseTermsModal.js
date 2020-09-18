/**
 * @version 0.9
 */
import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Linking
} from 'react-native'
import { connect } from 'react-redux'

import RNExitApp from 'react-native-exit-app'
import Modal from 'react-native-modal'

import GradientView from '../../../components/elements/GradientView'

import { hideModal } from '../../../appstores/Stores/Modal/ModalActions'

import ALL_TERMS from '../../../../__terms__/ALL'
import { strings, sublocale } from '../../../services/i18n'

import Entypo from 'react-native-vector-icons/Entypo'

const width = Dimensions.get('window').width

const { height: WINDOW_HEIGHT } = Dimensions.get('window')

export class LicenseTermsModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            licenseAccepted: true,
            referralProgramLink: 'https://docs.google.com/document/d/1bc3zxpsmwVtF0KrMPdaBsWAhI9IitssZ8KZ4KNxaUEA'
        }
    }

    handleDecline = () => {
        RNExitApp.exitApp()
    }

    render() {
        const { show } = this.props

        let sub = sublocale()
        if (sub !== 'uk' && sub !== 'ru') {
            sub = 'en'
        }

        return (
            <Modal style={styles.modal} hasBackdrop={false} isVisible={show}>
                <View style={styles.content}>
                    <GradientView style={styles.bg} array={styles_.array} start={styles_.start} end={styles_.end}>
                        <TouchableOpacity onPress={hideModal} style={styles.cross}>
                            <Entypo style={styles.cross} name="cross" size={22} color={'#f4f4f4'}/>
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {strings('modal.licenseTerms.title')}
                        </Text>
                        <Text style={styles.text}>
                            {strings('modal.licenseTerms.description')}
                        </Text>
                        <ScrollView style={{ width: '100%', maxHeight: WINDOW_HEIGHT - 350 }}>
                            <Text style={styles.subtitle}>
                                {strings('settings.about.terms')}
                            </Text>
                            <Text style={styles.text}>
                                {ALL_TERMS.TERMS_OF_USE_1[sub]}
                            </Text>
                            <Text style={styles.text}>
                                {ALL_TERMS.TERMS_OF_USE_2[sub]}
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.referralProgramLink)}>
                                <Text style={styles.link}>
                                    {
                                        '       ' + this.state.referralProgramLink.replace(/(.)(?=.)/g, '$1 ')
                                    }
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.subtitle}>
                                {strings('settings.about.privacy')}
                            </Text>
                            <Text style={styles.text}>
                                {ALL_TERMS.PRIVACY_POLICY[sub]}
                            </Text>
                            <Text style={styles.text}>
                                {ALL_TERMS.DO_YOU_AGREE[sub]}
                            </Text>
                        </ScrollView>
                        {/*<View>*/}
                        {/*    <TouchableOpacity style={styles.accept} onPress={this.handleCheckBox}>*/}
                        {/*        <Checkbox*/}
                        {/*            value={this.state.licenseAccepted}*/}
                        {/*        />*/}
                        {/*        <Text style={styles.accept__text}>*/}
                        {/*            { strings('modal.licenseTerms.checkboxText') }*/}
                        {/*        </Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</View>*/}
                    </GradientView>
                </View>
            </Modal>
        )
    }
}

const styles_ = {
    array: ['#43156d', '#7127ab'],
    start: { x: 0.0, y: 0.5 },
    end: { x: 1, y: 0.5 }
}

const mapStateToProps = (state) => {
    return {
        toolTipsStore: state.toolTipsStore
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LicenseTermsModal)

const styles = {
    modal: {
        justifyContent: 'center',
        maxHeight: WINDOW_HEIGHT - 50
    },
    content: {
        //height: 450,
        borderRadius: 14,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4

    },
    bg: {
        paddingTop: 15,

        alignItems: 'center',
        borderRadius: 15
    },
    cross: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 14
    },
    icon: {
        width: 230,
        height: 220,
        marginTop: 10,
        marginBottom: 10
    },
    title: {
        marginBottom: 5,
        fontFamily: 'SFUIDisplay-Semibold',
        fontSize: 18,
        color: '#f4f4f4'
    },
    subtitle: {
        marginLeft: 28,
        fontFamily: 'SFUIDisplay-Semibold',
        fontSize: 16,
        color: '#f4f4f4'
    },
    text: {
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 10,

        fontFamily: 'SFUIDisplay-Regular',
        fontSize: 14,
        textAlign: 'left',
        color: '#f4f4f4'
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 24,
        paddingBottom: 24
    },
    btn: {
        width: width > 320 ? 122 : 100
    },
    accept: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        padding: 15
    },
    accept__text: {
        marginLeft: 10,

        fontSize: 14,
        color: '#f4f4f4'
    },
    link: {
        marginBottom: 20,
        marginTop: -10,
        paddingHorizontal: 15,

        fontFamily: 'SFUIDisplay-Semibold',
        fontSize: 14,
        letterSpacing: -1,
        color: '#f4f4f4'
    }
}
