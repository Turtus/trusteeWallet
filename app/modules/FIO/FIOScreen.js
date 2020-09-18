/**
 * @version 0.9
 */
import React, { Component } from 'react'
import { View, Text, ScrollView, Image, TextInput  } from 'react-native'

import Navigation from '../../components/navigation/Navigation'
import Button from '../../components/elements/Button'



class FIOScreen extends Component {


    render() {
        return (
            <View>
                <Navigation
                    //title={strings('assets.mainTitle')}
                    title={'Fio screen'}
                />
                
                <View style={{paddingTop: 90, height: '100%'}}>



                <View  style={styles.container}>
                    <View>
                        <Text style={styles.txt}>Enter Recipient FIO, ENS, or Public Address</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => console.log('Input changed')}
                        />
                    </View>

                    <View style={{ flex: 1,  paddingVertical: 20}}>
                        <ScrollView>

                            <View  style={styles.fio_item}>
                                <Image style={styles.fio_img} resize={'stretch'} source={require('../../assets/images/fio-logo.png')}/>
                                <Text style={styles.fio_txt}>Fio Adress 1</Text>
                            </View>

                            <View  style={styles.fio_item}>
                                <Image style={styles.fio_img} resize={'stretch'} source={require('../../assets/images/fio-logo.png')}/>
                                <Text style={styles.fio_txt}>Fio Adress 2</Text>
                            </View>

                            <View  style={styles.fio_item}>
                                <Image style={styles.fio_img} resize={'stretch'} source={require('../../assets/images/fio-logo.png')}/>
                                <Text style={styles.fio_txt}>Fio Adress 3</Text>
                            </View>

                            <View  style={styles.fio_item}>
                                <Image style={styles.fio_img} resize={'stretch'} source={require('../../assets/images/fio-logo.png')}/>
                                <Text style={styles.fio_txt}>Fio Adress 4</Text>
                            </View>

                            <View  style={styles.fio_item}>
                                <Image style={styles.fio_img} resize={'stretch'} source={require('../../assets/images/fio-logo.png')}/>
                                <Text style={styles.fio_txt}>Fio Adress 5</Text>
                            </View>

                            <View  style={styles.fio_item}>
                                <Image style={styles.fio_img} resize={'stretch'} source={require('../../assets/images/fio-logo.png')}/>
                                <Text style={styles.fio_txt}>Fio Adress 6</Text>
                            </View>

                            <View  style={styles.fio_item}>
                                <Image style={styles.fio_img} resize={'stretch'} source={require('../../assets/images/fio-logo.png')}/>
                                <Text style={styles.fio_txt}>Fio Adress 7</Text>
                            </View>


                        </ScrollView>
                    </View>

                    <View style={{marginTop: 20}}>
                        <Button press={() =>  console.log('select FIO pressed')}>
                            select FIO
                        </Button>
                    </View>



                </View>








                </View>
            </View>
        );
    }
}

export default FIOScreen


const styles = {

    container: {
        padding: 30,
        height: '100%',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
    },

    input: {
        fontFamily: 'SFUIDisplay-Regular',
        fontSize: 19,
        color: '#404040',
        marginTop: 0,
        marginBottom: 20,
        height: 40,
        borderColor: '#864dd9',
        borderBottomWidth: 3
    },

    fio_item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e3e6e9',
        backgroundColor: '#fff',
        borderRadius: 20
    },

    fio_txt: {
        fontFamily: 'SFUIDisplay-Regular',
        fontSize: 19,
        color: '#404040',
    },

    fio_img: {
        width: 25,
        height: 25,
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#e3e6e9',
        padding: 20,
        borderRadius: 100
    },

    txt: {
        fontFamily: 'SFUIDisplay-Regular',
        fontSize: 19,
        color: '#777',
    },


}
