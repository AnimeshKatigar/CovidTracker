import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import "./Infobox.css";
import numeral from 'numeral'



function InfoBox({title, isRed, cases, active, total, ...props}) {
    

    return (
        <Card 
        onClick={props.onClick}
        className={`infoBox ${active && 'infoBox--selected'} ${isRed && "infoBox--red"}`}>
            <CardContent >
                <Typography className="infoBox__title" 
                color="textSecondary"
                >
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
                    {numeral(total).format("0,0")} Total
                </h2>
                
                <Typography className="infoBox__total"
                color="textSecondary"
                >
                {cases} 
                 
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox

