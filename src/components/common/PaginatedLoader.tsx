import { Divider, Fab, Grid, Theme, Toolbar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as React from "react";

interface PaginatedLoaderProps <T> {
    itemNames: string[];
    fetchItem: (itemId: string)=>Promise<T|null>;
    renderItem: (item: T, key: number)=> React.ReactChild;
    perPage: number;
    classes?: {
        title: string;
        grow: string;
    };
}

interface PaginatedLoaderState <T> {
    items: T[];
    page: number;
}

const styler = withStyles((theme: Theme)=>({
    title: {
        padding: theme.spacing(1)
    },
    grow: {
        flexGrow: 1
    }
}));

class PaginatedLoaderComponent <S extends {}>
extends React.Component<PaginatedLoaderProps<S>, PaginatedLoaderState<S>> {

    constructor(props: PaginatedLoaderProps<S>){
        super(props);

        this.state = {
            items: [],
            page: 1
        };
    }

    componentDidMount(){
        this.loadItem(0,1);
    }

    protected loadItem = (next: number, page: number)=>{
        const { items} = this.state;
        const {itemNames, perPage, fetchItem}= this.props;

        if(next + (page-1) * perPage >= itemNames.length){
            return;
        }

        fetchItem(itemNames[next + (page -1 ) * perPage ]).then(item=>{
            if(item){
                this.setState({
                    items: [...items,item]
                });
            }

            if( perPage > next +1 ){
                this.loadItem(next+1, page);
            }
        });

    }

    protected handleClickLoadMore = ()=>{
        this.setState({
            page: this.state.page + 1
        },()=>{
            this.loadItem(0,this.state.page);
        });
    }

    public render(){

        const {items} = this.state;
        const {itemNames, classes, renderItem} = this.props;

        if(!classes)
            return null;

        return (
            <React.Fragment>
                <Grid container={true} justify="space-between" >
                    {items.map((item,itemKey)=>renderItem(item,itemKey))}
                </Grid>
                <Divider />
                <Toolbar
                    variant="dense"
                >
                    <div className={classes.grow}/>
                    <Fab
                        color="secondary"
                        variant="extended"
                        size="small"
                        onClick={this.handleClickLoadMore}
                        disabled={items.length === itemNames.length}
                    >
                        Load More
                    </Fab>
                    <div className={classes.grow}/>
                </Toolbar>
            </React.Fragment>
        );
    }
}

const PaginatedLoader =  (styler(PaginatedLoaderComponent) as any) as new <T>() => PaginatedLoaderComponent<T>;

export default PaginatedLoader;