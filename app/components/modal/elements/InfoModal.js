/**
 * @version 0.10
 */
import React, { Component } from 'react'
import { View } from 'react-native'

import Layout from '../../../components/elements/modal/Layout'
import Title from '../../../components/elements/modal/Title'
import Text from '../../../components/elements/modal/Text'
import Button from '../../../components/elements/modal/Button'
import Icon from '../../../components/elements/modal/Icon'
import { hideModal } from '../../../appstores/Stores/Modal/ModalActions'

export default class InfoModal extends Component {

    constructor(props) {
        super(props)
    }

    handleHide = () => {
        const { callback } = this.props

        hideModal()
        if (typeof callback != 'undefined') {
            callback()
        }

    }

    render() {
        const { show } = this.props
        const { icon, title, description, component, error } = this.props.data
        if (typeof (error) !== 'undefined' && typeof (error.log) !== 'undefined') {
            // make visible for advanced users or devs @Misha? alert(error.log)
        }
        return (
            <Layout visible={show}>
                <View>
                    <Icon callback={this.handleHide} icon={`${icon === true ? 'success' : icon === false ? 'fail' : icon === null ? 'warning' : icon.toLowerCase()}`}/>
                    <Title style={styles.title}>
                        {title}
                    </Title>
                    <View style={{ marginTop: 8, marginBottom: 15 }}>
                        <Text style={styles.text}>
                            {description}
                        </Text>
                    </View>
                    {typeof component != 'undefined' ? component() : null}
                    <View style={{marginBottom: 30 }}>
                        <Button onPress={this.handleHide} color={ icon === true ? '#864DD9' : icon === false ? '#E54C4C' : icon === null ? '#F59E6C' : '#2A7FDB' } shadow={true} style={{ marginTop: 17 }}>
                            Ok
                        </Button>
                    </View>
                </View>
            </Layout>
        )
    }
}

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
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        letterSpacing: 0.5,
        marginBottom: -6
    }
}
