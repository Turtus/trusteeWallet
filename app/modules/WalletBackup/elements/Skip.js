/**
 * @version 0.10
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'

import Layout from '../../../components/elements/modal/Layout'
import Title from '../../../components/elements/modal/Title'
import Text from '../../../components/elements/modal/Text'
import Button from '../../../components/elements/modal/Button'
import Icon from '../../../components/elements/modal/Icon'

import { hideModal, showModal } from '../../../appstores/Stores/Modal/ModalActions'

import NavStore from '../../../components/navigation/NavStore'

import Log from '../../../services/Log/Log'
import { strings } from '../../../services/i18n'

import App from '../../../appstores/Actions/App/App'
import { setLoaderStatus } from '../../../appstores/Stores/Main/MainStoreActions'
import { setCallback, proceedSaveGeneratedWallet } from '../../../appstores/Stores/CreateWallet/CreateWalletActions'
import walletActions from '../../../appstores/Stores/Wallet/WalletActions'

class Skip extends Component {

    constructor(props) {
        super(props)
    }

    handleSkip = async () => {
        hideModal()

        const { walletName, walletMnemonic, callback } = this.props.createWallet

        try {
            setLoaderStatus(true)

            let tmpWalletName = walletName

            try {
                if (!tmpWalletName) {
                    tmpWalletName = await walletActions.getNewWalletName()
                }
            } catch (e) {
                e.message += ' while getNewWalletName'
                throw e
            }

            try {
                await proceedSaveGeneratedWallet({
                    walletName: tmpWalletName,
                    walletMnemonic
                })
            } catch (e) {
                e.message += ' while proceedSaveGeneratedWallet'
                throw e
            }

            try {
                await App.refreshWalletsStore({ firstTimeCall: false, source: 'WalletBackup.handleSkip' })
            } catch (e) {
                e.message += ' while refreshWalletsStore'
                throw e
            }

            setLoaderStatus(false)

            showModal({
                type: 'INFO_MODAL',
                icon: true,
                title: strings('modal.walletBackup.success'),
                description: strings('modal.walletBackup.walletCreated')
            }, async () => {
                if (callback === null) {
                    NavStore.reset('DashboardStack')
                } else {
                    callback()
                    setCallback({ callback: null })
                }
            })
        } catch (e) {
            Log.err('WalletBackup.Skip error ' + e.message)
        }

    }

    handleHide = () => {
        hideModal()
    }

    render() {
        return (
            <Layout visible={this.props.show}>
                <View>
                    <Icon icon='warning'/>
                    <Title style={styles.title}>
                        {strings('walletBackup.skipElement.title')}
                    </Title>
                    <View style={{ marginTop: 8, marginBottom: -5 }}>
                        <Text style={styles.text}>
                            {strings('walletBackup.skipElement.description')}
                        </Text>
                    </View>
                    <View>
                        <Button onPress={this.handleHide} color={'#F59E6C'} shadow={true} style={{ marginTop: 17 }}>
                            {strings('walletBackup.skipElement.cancel')}
                        </Button>
                        <Button onPress={this.handleSkip} style={{backgroundColor: 'none', color: '#F59E6C'}}>
                            {strings('walletBackup.skipElement.yes')}
                        </Button>
                    </View>
                </View>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        createWallet: state.createWalletStore,
        skipModal: state.createWalletStore.skipModal
    }
}

export default connect(mapStateToProps, {})(Skip)

const styles = {
    title: {
        fontFamily: 'Montserrat-Bold',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 26,
        textAlign: 'center',
        color: '#404040',
        marginTop: -10,
        marginBottom: -2
    },
    text: {
        color: '#5C5C5C',
        fontFamily: 'SFUIDisplay-Regular',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        letterSpacing: 0.5,
        marginBottom: -6
    }
}


/*
<Modal
                type='fail'
                title='Enter a password to encrypt your wallet'
                descr='You have done a mistake in recovery phrase. Please try again.'
                visible={this.state.visible}
                callback={this.callback}
            />
 */
