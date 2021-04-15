# Display list of paths as a material UI tree view

Material UI is a popular frontend react framework. And it has very
useful and easy to use built in components. But when you developing a
react tree viewer for browsing files, it will mess you up. Because
Material UI has a different approach to make nested lists.

- How to create nested lists on other frameworks.
```tsx
<List>
    <ListItem>
        <ListItemText primary="Item 1"/>
        <List>
            <ListItem>
                <ListItemText primary="Nested Item 1"/>
            </ListItem>
        </List>
    </ListItem>
</List>
```

- How to create nested lists on Material UI.
```tsx
<List>
    <ListItem>
        <ListItemText primary="Item 1"/>
    </ListItem>
    <Collapse in={open} >
        <List>
            <ListItem>
                <ListItemText primary="Nested Item 1"/>
            </ListItem>
        </List>
    </Collapse>
</List>
```

So rendering process will getting complicated if you processed your
list of paths first. 

## Initializing the project

As a quick start copy the [Material UI React
Example] (https://github.com/mui-org/material-ui/tree/master/examples/create-react-app-with-typescript) to your local folder.

```
$ curl https://codeload.github.com/mui-org/material-ui/tar.gz/master | tar -xz --strip=3 material-ui-master/examples/create-react-app-with-typescript
```

And also install all dependencies.

```
$ yarn
```

And delete all other components and make it as an empty project.

```tsx
# src/App.tsx

import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
            File Browser
        </Typography>
      </Box>
    </Container>
  );
}
```

## Creating a component

Next create an empty component to implement our file browser.

```tsx
# src/FileBrowser.tsx

import withStyles from "@material-ui/core/styles/withStyles";
import * as React from "react";

const styler = withStyles((theme) => ({
    root: {
        width: 400,
    },
}));

interface FileBrowserProps {
    classes: {
        root: string;
    };
}

class FileBrowser extends React.Component<FileBrowserProps> {
    public render() {
        const { classes } = this.props;
        return <div className={classes.root}>My File Browser</div>;
    }
}

export default styler(FileBrowser);
```

At the moment this component contains only a text. Also include it to 
the `App.tsx` to display on the browser.

```tsx
# src/App.tsx

// top of the file
import FileBrowser from "./FileBrowser";

// Inside render function
<FileBrowser/>
```

## Taking paths to the component

To take the paths as a prop to our `FileBrowser` component, add it to
the prop types.

```tsx
# src/FileBrowser.tsx

interface FileBrowserProps {
    // ...
    paths: string[];
}

```

And also pass paths as a prop from the `App` component.

```tsx
# src/App.tsx

<FileBrowser
    paths={[
        "abc/def",
        "abc/ghi/jkl",
        "abc/ghi/yz/",
        "pqr",
        "abc/ghi/mno",
        "stu/vwx",
    ]}
/>
```

## Rendering the tree view

When rendering tree views, we have to use nested functions. Because we
can not estimate the nested level and rendering process should do in a
dynamic way.

Define a function named `renderList` in the `FileBrowser` component to
render the root file list and nested file lists. This function should take
all paths as an array of strings. And it should return an array of
`ListItem` elements and `Collapse` elements. So I am using the return
type as `JSX.Element`.

```tsx
# src/FileBrowser.tsx

import List from "@material-ui/core/List";
// ...

class FileBrowser extends React.Component<FileBrowserProps> {

    protected renderList(paths: string[]): JSX.Element[]{
        
    }

    public render() {
        const { classes, paths } = this.props;
        return <div className={classes.root}>
                <List>
                    {this.renderList(paths)}
                </List>
            </div>;
    }
}

```

Now typescript compiler will returning an error that saying "A function
whose declared type is neither 'void' nor 'any' must return a value.".
It means we should return an array of elements. So define an
empty array and returning it.

```tsx
# src/FileBrowser.tsx

protected renderList(paths: string[]): JSX.Element[]{
    const listItems: JSX.Element[] = [];

    return listItems;
}
```

As the next step we should render the root elements by iterating over
paths.

```tsx
# src/FileBrowser.tsx

const listItems: JSX.Element[] = [];

paths.forEach((path) => {
    const slices = path.split("/");

    listItems.push(
        <ListItem>
            <ListItemText primary={slices[0]} />
        </ListItem>
    );
});

return listItems;
```

Now you can see a list of folder names on the browser. But it has
duplicated folder names. To avoid these duplicates, we should push those
elements to the array once all child nodes iterated. So we need to 
define another variable to store the previous folder name to compare
with the current folder name. We can push items to the array if current
folder name and previous folder names are different.

```tsx
# src/FileBrowser.tsx

protected renderList(paths: string[]): JSX.Element[] {
    const listItems: JSX.Element[] = [];
    let previous: string | undefined;

    paths.forEach((path) => {
        const slices = path.split("/");
        const current = slices[0];

        if (previous && previous !== current) {
            listItems.push(
                <ListItem>
                    <ListItemText primary={previous} />
                </ListItem>
            );
        }
        previous = current;
    });

    listItems.push(
        <ListItem>
            <ListItemText primary={previous} />
        </ListItem>
    );

    return listItems;
}
```

Now the first two duplicated items rendered as a one item. But there is
one more duplicated item after the second item. This duplicated item was
happened because of we did not used any sorting algorithm to our paths
list. We have to sort all paths by the nested level and the name.

```tsx
# src/FileBrowser.tsx

// ...
const sortedPaths = paths.sort((a, b) => {
    return (
        b.split("/").length - a.split("/").length || a.localeCompare(b)
    );
});

sortedPaths.forEach((path) => {
// ...
```

All items of the root list has rendered without any issue. Now we have
to render sub lists. We should store all child nodes in an
array till rendering the folder name. Before that there is a small nit
to fix. We can define a new function to render an item and reuse it in
both places.

```tsx
# src/FileBrowser.tsx

/**
 * @param pwd The current path location
 * @param path The path to render
 * @param isDir Weather that item is a directory or not
 * @param childrens If this item is a directory, it's childs.
 */
protected renderItem(
    pwd: string,
    path: string,
    isDir: boolean,
    childrens: string[] = []
): JSX.Element {
    const name = path.substr(pwd.length);
    return (
        <React.Fragment>
            <ListItem>
                <ListItemText primary={name} />
            </ListItem>
            {isDir && (
                <Collapse in={true}>
                    <List>{this.renderList(childrens)}</List>
                </Collapse>
            )}
        </React.Fragment>
    );
}

```

When we rendering nested lists, we want to know the current nested level
and path. So we have to pass an additional parameter to the `renderList`
function to pass the current path. In the root folder it should be
empty.

```tsx
# src/FileBrowser.tsx

protected renderItem(
    pwd: string,
    path: string,
    isDir: boolean,
    childrens: string[] = []
): JSX.Element {
    // ...
    <List>{this.renderList(childrens, pwd.concat(name))}</List>
    // ...
}

protected renderList(paths: string[], pwd: string = ""): JSX.Element[] {
// ...
}
```

By default `pwd` is an empty string. So in the root directory it
considering as an empty value. When rendering a sub directory we have to
pass the next path as `pwd`.

At the moment in `renderList` function the folder name is not depending
on the `pwd`. So it will always provide the name of the root folder,
even in sub directories. So we have to change the folder names to change
according to the `pwd`.

```tsx
# src/FileBrowser.tsx

// ...
sortedPaths.forEach((path) => {
    const relativePath = pwd? path.substr(pwd.length): path;
    const slices = relativePath.split("/");
    const current = slices[0];
    // ...
});
// ...
```

Next we have to store all child nodes in an array and render it with the
folder. After rendered the folder the array should be empty to reuse it
for the next folder.

```tsx
# src/FileBrowser.tsx

protected renderList(paths: string[], pwd: string = ""): JSX.Element[] {
    // ...
    const nestedPaths: string[] = [];

    // ...
        if (previous && previous !== current) {
            // ... 
            nestedPaths.length = 0;
        }
        nestedPaths.push(path);
```

After that we can use the `renderItem` function and pass all parameters
to it.

```tsx
# src/FileBrowser.tsx

protected renderList(paths: string[], pwd: string = ""): JSX.Element[] {
    // ...
    sortedPaths.forEach((path) => {
        // ...

        if (previous && previous !== current) {
            listItems.push(
                this.renderItem(
                    pwd,
                    pwd.concat(previous, "/"),
                    false,
                    nestedPaths
                )
            );
            nestedPaths.length = 0;
        }
        nestedPaths.push(path);
        previous = current;
    });

    listItems.push(
        this.renderItem(
            pwd,
            pwd.concat(previous as string, "/"),
            false,
            nestedPaths
        )
    );

    return listItems;
}

```

But you can not see any sub lists for the moment. Because we always
passed `false` for the `isDir` parameter.

Always a directory contains a trailing back slash (`/`). So 
`relativePath.split('/')` should be more than one if it a directory.

```tsx
# src/FileBrowser.tsx

protected renderList(paths: string[], pwd: string = ""): JSX.Element[] {
    // ...
    const nestedPaths: string[] = [];
    let isPrevDir = false;

    // ...
    sortedPaths.forEach((path) => {
        // ...
        if (previous && previous !== current) {
            listItems.push(
                this.renderItem(
                    pwd,
                    pwd.concat(previous, "/"),
                    isPrevDir,
                    nestedPaths
                )
            );
            // ...
        }
        // ...
        isPrevDir = slices.length>1;
    });

    listItems.push(
        this.renderItem(
            pwd,
            pwd.concat(previous as string, "/"),
            isPrevDir,
            nestedPaths
        )
    );
    // ...
}
```

After that all lists rendered. But we can not identify that each
items rendered from which list. Add an extra margin for the list to
resolve this.

```
# src/FileBrowser.tsx

const styler = withStyles((theme) => ({
    // ...
    list: {
        marginLeft: theme.spacing(4)
    },
}));

interface FileBrowserProps {
    classes: {
        // ...
        list: string;
    };
    // ...
}

// ...
    protected renderItem(
        pwd: string,
        path: string,
        isDir: boolean,
        childrens: string[] = []
    ): JSX.Element {
        const {classes} = this.props;
        // ...
            <List className={classes.list}>
        // ...
    }
```

You can see there are trailing backslashes in also file names. We should
avoid these backslashes from concatenating.

```tsx
# src/FileBrowser.tsx

protected renderList(paths: string[], pwd: string = ""): JSX.Element[] {
    // ...
    if (previous && previous !== current) {
        listItems.push(
            this.renderItem(
                pwd,
                pwd.concat(previous, isPrevDir ? "/" : ""),
                isPrevDir,
                nestedPaths
            )
        );
        nestedPaths.length = 0;
    } 
    // ...
    listItems.push(
        this.renderItem(
            pwd,
            pwd.concat(previous as string, isPrevDir ? "/" : ""),
            isPrevDir,
            nestedPaths
        )
    );
}
```

You can see an empty item after the `yz` folder. It caused because `yz`
is an empty folder. When we splitting empty directory paths by 
backslashes, An extra empty string will remain as the last nested folder
name. We should skip these empty folder names to resolve this issue.

```tsx
# src/FileBrowser.tsx

// ...
sortedPaths.forEach((path) => {
    const relativePath = path.substr(pwd.length);
    const slices = relativePath.split("/");
    const current = slices[0];

    if(current!=""){
        // ...
    }
}
// ...
if (previous) {
    listItems.push(
        this.renderItem(
            pwd,
            pwd.concat(previous, isPrevDir ? "/" : ""),
            isPrevDir,
            nestedPaths
        )
    );
}

```

Next add icons to identify folders and files. To add icons install the
`@material-ui/icons` package.

```
$ yarn add @material-ui/icons@latest
```

And add it to `FileBrowser` component.

```tsx
# src/FileBrowser.tsx

// ...
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Description from "@material-ui/icons/Description";
import Folder from "@material-ui/icons/Folder";

// ...
<ListItem>
    <ListItemIcon>
        {isDir ? <Folder /> : <Description />}
    </ListItemIcon>
    <ListItemText primary={name} />
</ListItem>
// ...
```
