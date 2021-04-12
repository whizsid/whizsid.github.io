import * as React from "react";
import {
    withStyles,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { Facebook, GitHub, LinkedIn, Mail, MyLocation, Telegram, Twitter, WhatsApp } from "@material-ui/icons";

const styler = withStyles((theme) => ({
    header: {
        background: "#759b91",
        padding: theme.spacing(1),
        color: theme.palette.common.white,
    },
    map: {
        height: 400,
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            width: "100vw"
        }
    },
    popup: {
        textAlign: "center",
    },
}));

interface ContactSectionProps {
    classes: {
        header: string;
        map: string;
        popup: string;
    };
}

class ContactSection extends React.Component<ContactSectionProps> {
    constructor(props: ContactSectionProps) {
        super(props);
    }

    public render() {
        const { classes } = this.props;

        return (
            <div>
                <Typography className={classes.header} variant="h6">
                    {" "}
                    Contact{" "}
                </Typography>
                <Grid container={true}>
                    <Grid item={true} md={4}>
                        <MapContainer
                            className={classes.map}
                            center={[6.4373783, 80.1889149]}
                            zoom={13}
                        >
                            <TileLayer
                                attribution={
                                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                }
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[6.4373783, 80.1889149]}>
                                <Popup>
                                    <div className={classes.popup}>
                                        <img
                                            width="64"
                                            src="avatar.png"
                                            alt="Ramesh Kithsiri With Sunglasses"
                                        />
                                        <Typography variant="body1">
                                            Ramesh Kithsiri
                                        </Typography>
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </Grid>
                    <Grid item={true} md={8}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <MyLocation />
                                </ListItemIcon>
                                <ListItemText primary="Meegahathanna, Sri Lanka" />
                            </ListItem>
                            <ListItem button={true} component="a"  href="mailto:whizsid@aol.com" >
                                <ListItemIcon>
                                    <Mail />
                                </ListItemIcon>
                                <ListItemText primary="whizsid@aol.com" />
                            </ListItem>
                            
                                <ListItem button={true} component="a"  href="https://m.me/Prince.Of.SL" >
                                <ListItemIcon>
                                    <Facebook />
                                </ListItemIcon>
                                <ListItemText primary="Prince.Of.SL" />
                            </ListItem>
                            <ListItem button={true} component="a"  href="https://www.linkedin.com/in/ramesh-kithsiri-327414170/" >
                                <ListItemIcon>
                                    <LinkedIn />
                                </ListItemIcon>
                                <ListItemText primary="Ramesh Kithsiri" />
                            </ListItem>
                            <ListItem button={true} component="a"  href="https://twitter.com/whiz_sid" >
                                <ListItemIcon>
                                    <Twitter />
                                </ListItemIcon>
                                <ListItemText primary="whiz_sid" />
                            </ListItem>
                            <ListItem button={true} component="a"  href="whatsapp://send?phone=+94758732973&text=Hy%20Ramesh" >
                                <ListItemIcon>
                                    <WhatsApp />
                                </ListItemIcon>
                                <ListItemText primary="+94758732973" />
                            </ListItem>
                            <ListItem button={true} component="a"  href="https://t.me/whizsid" >
                                <ListItemIcon>
                                    <Telegram />
                                </ListItemIcon>
                                <ListItemText primary="whizsid" />
                            </ListItem>
                                <ListItem button={true} component="a"  href="https://github.com/whizsid" >
                                <ListItemIcon>
                                    <GitHub />
                                </ListItemIcon>
                                <ListItemText primary="whizsid" />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default styler(ContactSection);
