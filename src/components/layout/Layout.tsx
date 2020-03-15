import * as React from "react";
import Header from "./Header";

interface Props {
    children: React.ReactChild;
    header?: boolean;
}

class Layout extends React.Component <Props>{

    public static defaultProps = {
        header: true
    };

    public render(){
        const {children} = this.props;

        return (
            <div>
                <Header/>
                {children}
            </div>
        );
    }
}

export default Layout;