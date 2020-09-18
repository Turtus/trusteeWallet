import React from 'react'
import Svg, { Path } from 'react-native-svg'
import OldPhone from '../../services/UI/OldPhone/OldPhone'
import { Image } from "react-native"

function SvgComponent(props) {
    const ifSelectStyle = props.ifSelectStyle || false
    if (OldPhone.isOldPhone()) {
        return (
            <Image
                width={54} height={16}
                resizeMode='stretch'
                source={ifSelectStyle ? require('./visa_2.png') : require('./visa.png')}/>
        )
    }
    return (
        <Svg width={54} height={16}>
            <Path
                d="M25.338 5.15c-.027 2.202 1.957 3.43 3.452 4.16 1.536.75 2.052 1.23 2.046 1.901-.012 1.026-1.226 1.478-2.361 1.496-1.982.03-3.134-.536-4.05-.966l-.713 3.35c.919.424 2.62.795 4.385.81 4.141 0 6.85-2.05 6.865-5.228.017-4.034-5.564-4.257-5.526-6.06.013-.547.534-1.13 1.674-1.279.564-.075 2.122-.132 3.888.684l.693-3.24C34.74.43 33.52.097 32 .097c-3.899 0-6.64 2.078-6.662 5.053zM42.352.378c-.757 0-1.394.443-1.678 1.122l-5.917 14.165h4.139l.823-2.282h5.058l.478 2.282h3.647L45.72.377h-3.367zm.578 4.13l1.195 5.74h-3.271l2.076-5.74zM20.32.377l-3.262 15.287h3.944L24.262.377h-3.941zm-5.834 0l-4.104 10.405-1.66-8.847C8.525.948 7.756.377 6.901.377H.193L.098.821c1.378.3 2.943.784 3.891 1.3.58.317.746.593.937 1.344L8.07 15.664h4.167L18.628.377h-4.142z"
                fill={props.fill}
            />
        </Svg>
    )
}

export default SvgComponent
