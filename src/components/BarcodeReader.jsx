import React from 'react'
import { useState } from 'react'
import useScanDetection from 'use-scan-detection'

const BarcodeReader = () => {
    const [barcodeScan,setBarcodeScan] = useState("No barcode scanned!")
    useScanDetection({
        onComplete:setBarcodeScan,
        minLength:3
    })
  return (
    <div>
        <p>BarcodeScan:{barcodeScan}</p>
    </div>
  )
}

export default BarcodeReader