import { Collapse, List, ListItem, ListItemText, Theme } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import { getPost, getPostsForMonth, getTimeline } from "../../agent";
import { Post } from "../../types";

export interface HistoryMonthItem {
	month: number;
	name: string;
	posts: Post[];
	open: boolean;
	loaded: boolean;
}

export interface HistoryYearItem {
	year: number;
	months: HistoryMonthItem[];
	open: boolean;
}

export interface HistoryState {
	years: HistoryYearItem[];
}

export interface HistoryProps {
	classes: {
		nested: string;
	};
}

const MONTHS: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

const styler = withStyles((theme: Theme) => ({
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

class History extends React.Component<HistoryProps & RouteComponentProps, HistoryState> {
	constructor(props: HistoryProps & RouteComponentProps) {
		super(props);

		this.state = {
			years: []
		};
	}

	componentDidMount() {
		const { years } = this.state;

		getTimeline().then((response) => {
			if (response.success) {
				const dates = response.dates;

				const months: string[] = [];
				let modYears = [ ...years ];

				for (const date of dates) {
					const splited = date.split("-");

					splited.pop();

					if (!months.includes(splited.join("-"))) {
						let yearIndex = years.findIndex((year) => year.year === parseInt(splited[0]));

						if (yearIndex === -1) {
							yearIndex = modYears.length;
							modYears = [
								...modYears,
								{
									year: parseInt(splited[0]),
									months: [],
									open: false
								}
							];
						}

						if (
							modYears[yearIndex].months.findIndex((month) => month.month === parseInt(splited[1])) +
								1 ===
							0
						) {
							modYears[yearIndex].months.push({
								month: parseInt(splited[1]),
								posts: [],
								open: false,
								name: MONTHS[parseInt(splited[1]) - 1],
								loaded: false
							});
						}

						months.push(splited.join("-"));
					}
				}

				this.setState({
					years: modYears
				});
			}
		});
	}

	protected handleClickYear = (yearKey: number) => (e: React.MouseEvent) => {
		this.setState({
			years: this.state.years.map((year, key) => {
				if (key === yearKey) {
					return { ...year, open: !year.open };
				}

				return year;
			})
		});
	}

	protected loadPostsOneByOne = (yearKey: number, monthKey: number, postIds: string[], posts: (Post | null)[]) => {
		const nextIndex = posts.length;

		if (nextIndex === postIds.length) {
			this.setState({
				years: this.state.years.map((year, key) => {
					if (key === yearKey) {
						return {
							...year,
							months: year.months.map((month, keyMonth) => {
								if (monthKey === keyMonth) {
									return {
										...month,
										loaded: true,
										posts: posts.filter((post) => post !== null) as Post[],
										open: !month.open
									};
								}
								return month;
							})
						};
					}
					return year;
				})
			});

			return;
		}

		getPost(postIds[nextIndex]).then((response) => {
			if (response.success) {
				this.loadPostsOneByOne(yearKey, monthKey, postIds, [ ...posts, {...response,id:postIds[nextIndex]} ]);
			} else {
				this.loadPostsOneByOne(yearKey, monthKey, postIds, [ ...posts, null ]);
			}
		});
	}

	protected handleClickMonth = (yearKey: number, monthKey: number) => (e: React.MouseEvent) => {
		const loaded = this.state.years[yearKey].months[monthKey].loaded;
		const open = this.state.years[yearKey].months[monthKey].open;

		if (!open && !loaded) {
			getPostsForMonth(
				this.state.years[yearKey].year,
				this.state.years[yearKey].months[monthKey].month
			).then((response) => {
				if (response.success) {
					this.loadPostsOneByOne(yearKey, monthKey, response.posts, []);
				}
			});
		} else {
			this.setState({
				years: this.state.years.map((year, key) => {
					if (key === yearKey) {
						return {
							...year,
							months: year.months.map((month, keyMonth) => {
								if (monthKey === keyMonth) {
									return {
										...month,
										open: !month.open
									};
								}

								return month;
							})
						};
					}

					return year;
				})
			});
		}
    }

    protected handleClickPost = (postId: string)=>(e:React.MouseEvent)=>{
        this.props.history.push("/blog/"+postId+".html");
    }

	public render() {
		const { years } = this.state;

		return (
			<List dense={true}>
				{years.map((yearData, yearKey) => (
					<React.Fragment key={yearKey}>
						<ListItem onClick={this.handleClickYear(yearKey)} button={true} dense={true}>
							<ListItemText primary={yearData.year} />
							{yearData.open ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={yearData.open} timeout="auto" unmountOnExit>
							<List dense={true}>
								{yearData.months.map((monthData, monthKey) => (
									<React.Fragment key={monthKey}>
										<ListItem
											onClick={this.handleClickMonth(yearKey, monthKey)}
											button={true}
											dense={true}
										>
											<ListItemText primary={"- - " + monthData.name.toUpperCase()} />
											{monthData.open ? <ExpandLess /> : <ExpandMore />}
										</ListItem>
										<Collapse in={monthData.open} timeout="auto" unmountOnExit>
											<List dense={true}>
												{monthData.posts.map((post, postKey) => (
                                                    <ListItem
                                                        button={true}
                                                        divider={true}
                                                        dense={true}
                                                        key={postKey}
                                                        onClick={this.handleClickPost(post.id)}
                                                    >
														<ListItemText primary={"- - - - " + post.title.toUpperCase()} />
													</ListItem>
												))}
											</List>
										</Collapse>
									</React.Fragment>
								))}
							</List>
						</Collapse>
					</React.Fragment>
				))}
			</List>
		);
	}
}

export default styler( withRouter(History));
