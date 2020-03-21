# Typescript, React, Redux එකට භාවිතා කරන ආකාරය

TypeScript යනු JavaScript සමග typedefinitions භාවිතා කිරීමට හැකි වන ලෙස Microsoft සමාගම විසින් නිර්මාණය කළ පරිගණ්ක භාශාවකි. Redux යනු state management කිරීමට යොදා ගන්නා ක්‍රමයකි. TypeScript සහ Redux එකට භාවිතා කිරීම තුළින් ඔබගේ React app එක ඉතාම පහසුවෙන් හා කාර්යක්ශම ලෙස නිම කළ හැකියි.

## App එකට අවශ්‍ය පසුබිම සාදා ගැනීම.

මෙම ලිපිය කියවීමට පෙර ඔබ nodejs install කර ගෙන තිබිය යුතුය.

මුලින්ම අපිට react typescript project එකක් සාදා ගැනීමට අවශ්‍යවේ. ඒ සඳහා npx command එක use කරමු.

```
$ npx create-react-app whizsid --template typescript
```

`whizsid` යන තැනට ඔබගේ project එකේ නම යොදන්න. 

ඉන්පසුව අවශ්‍යය depedencies install කරගමු. අපිට මේ සඳහා ප්‍රධාන depedency දෙකක් අවශ්‍යය වේ. `redux` හා `react-redux` යනු එම දෙකයි.

```
npm install redux react-redux --save
```

react-redux සඳහා typedefinitions ඇත්තේ වෙනත් package එකකය. අපට එයද install කිරීමට අවශ්‍යය වේ.

```
npm install @types/react-redux --save-dev
```

## File Structure එක සාදා ගැනීම.

redux typescript සමඟ භාවිතා කිරීම සඳහා standard file structure එක පහත ආකාරයට තිබිය යුතුය.

```
whizsid/
--| components/
----| componentName1.tsx
--| store/
----| componentName1
-------| types.ts
-------| reducers.ts
-------| actions.ts
--| rootReducer.ts
--| App.tsx
--| store.ts
--| index.ts
```

මෙහි `rootReducer.ts` යනු අනෙකුත් reducers සියල්ල එක් කරන තැන වේ. `store.ts` යනු සියලුම states ගබඩා කරන ස්ථානයයි.

## ප්‍රධාන files සධා ගනිමු.

ප්‍රථමයෙන්ම අපි `rootReducer.ts` එක සාදා ගත යුතුය. ඉහත පෙන්වූ ආකාරයට ඔබ `rootReducer.ts` යන file එක හදා ගන්න. ඉන් පසුව පහත codes copy කරන්න. 

```ts
// rootReducer.ts

import { combineReducers } from "redux";

const rootReducer = combineReducers({

});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
```

මෙහි `combineReducers` යන function එකෙන් සිදු කරන්නේ වෙනත් reducers සියල්ල මගින් ලැබෙන states එක object එකක් ලෙස සකස් කිරීමයි. පසුව ඇති පියවරයන් වල්දී මෙයට reducers එකතු කරන ආකාරය කතා කරමු.

මෙහි `AppState` යනුවෙන් export කරන්නේ සියලුම states එකතු වී සෑදෙන object එකේ type එකයි.

ඉන් පසුව අප `store.ts` file එක සාදා ගමු. 

```ts
// store.ts

import { createStore } from "redux";
import rootReducer from "./rootReducer";

export default createStore(rootReducer);
```

මෙහි `createStore` function එක මගින් අලුත් store එකක් සාදයි.

ඉන් පසුව අප අපගේ `App.tsx` file එක redux භාවිතා කිරීම සදහා වෙනස් කළ යුතුයි. 

```tsx
// App.tsx

import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            My App
        </div>
    </Provider>
  );
}

export default App;

```

`Provider` එක මගින් අපගේ app එකට අප සාදා ගත් `store.ts` එක connect කරයි.

## Component සහ Reducers සාදා ගන්නා ආකාරය.

ප්‍රථමයෙන්ම අප අපගේ component එක සාදා ගත යුතුය. උදාහරණයක් ලෙස අප සරල button එකක් ඇති switch component එකක් සාදා ගමු. මම එය `SwitchComponent.tsx` යන නමින් සාදා ගන්නා අතර එය `components` නම් folder එක තුළට දමනවා.

```tsx
// components/SwitchComponent.tsx

import * as React from "react";

class SwitchComponent extends React.Component {
    public render(){
        return (
            <button name="switch" id="switch" >Inactive</button>
        );
    }
}

export default SwitchComponent;

```

මෙහි ඇත්තේ සරල button එකක් පමණි. මෙය click කළ පසු Active ලෙසද නැවත  Click කළ පසු Inactive ලෙසද වෙනස් වෙන ලෙස අපට්‍ර සෑදිය යුතුය. මෙහි states දෙකක් වෙයි. එනමි Active සහ Inactive යන states ය.

ඉන් පසුව අප මෙම component එකට අදාළ `types.ts` file එක සාදා ගමු. `types.ts` file එකේ ඔබ මෙම component එක සඳහා භාවිතා කරන action types, state types සියල්ල සෑදිය යුතුය. සාමාන්‍යයෙන් අප typescript නොමතිව සාදන විටදී සියලුම action types එක file එකක සාදයි. නමුත් typescript භාවිතා කරන විටදී අප component වලට වෙන වෙනම files භාවිතා කරයි. එය සම්මත ක්‍රමයක් වේ.

```ts
// store/switchComponent/types.ts

export const ACTIVE_BUTTON = "ACTIVE_BUTTON";
export const INACTIVE_BUTTON = "INACTIVE_BUTTON";

export interface SwitchComponentState {
    active: boolean;
}

export interface ActiveButton {
    type: typeof ACTIVE_BUTTON;
}

export interface InactiveButton {
    type: typeof INACTIVE_BUTTON;
}

export type SwitchComponentActions = 
| ActiveButton
| InactiveButton;

```

මෙහිදී `SwitchComponentState` යනුවෙන් එක් boolean variable එකක් පමණක් ඇති type එකක් අප සාදා ගනු ලැබුවේ එම component එකට ඇත්තේ states දෙකක් පමණක් නිසා. එලෙසම `ActiveButton`,`InactiveButton` ලෙස action types දෙකක් සෑදුවේ multiple actions සමග මෙය සාදන ආකාරය පෙන්වීමටයි. නැතිනම් අපට `ToggleButton` ලෙස එක් action type එකකින්ම සිදු කළ හැකිය. මෙම component එකට භාවිතා කරන සියලුම actions අප `SwitchComponentActions` ලෙස export කරන්නේ reducers file එකේදී enum එකක් ලෙස එය භාවිතා කිරීමේදී පහසු වන නිසා.

දැන් අප අපගේ `reducers.ts` file එක සාදා ගනිමු. reducers file එක යනු actions මගින් state වෙනස් වෙන්නේ කෙසේද යන්න ලබා දෙන file එකයි.

```ts
// store/switchComponent/reducers.ts

import { 
    SwitchComponentState, 
    SwitchComponentActions, 
    ACTIVE_BUTTON, 
    INACTIVE_BUTTON 
} from "./types";

const initialState: SwitchComponentState = {
    active: false
};

export default (state=initialState,action: SwitchComponentActions): SwitchComponentState=>{
    switch (action.type) {
        case ACTIVE_BUTTON:
            return {
                ...state,
                active: true
            };
        case INACTIVE_BUTTON:
            return {
                ...state,
                active: false
            }
        default:
            return state;
    }
}

```

මෙහි `initialState` යනු app එක ආරම්භයේදී ඇති state එකයි. `ACTIVE_BUTTON` යන action එක ක්‍රියාකළ පසු `active` කියන state එක `true` වේ. `INACTIVE_BUTTON` විටදී `false` වෙයි.

දැන් අපි `actions.ts` file එක සාදාගමු. මෙවැනි කුඩා උදාහරණ වලට සාමාන්‍යයෙන් actions file එකක ඇති ඵලක් නැත. නමුත් සැබෑ ලෝකයේ භාවිතා කරන විට actions file එකක් අත්‍යවශ්‍යය වේ. actions file එක යනු component එකෙන් ලැබෙන දත්ත අවශ්‍ය ලෙස සකස් කර reducers වලට ලබා දෙන ස්ථානයයි. 

```ts
// store/switchComponent/actions.ts

import { ActiveButton, ACTIVE_BUTTON, InactiveButton, INACTIVE_BUTTON } from "./types";

export const activeButton = ():ActiveButton=>({
    type: ACTIVE_BUTTON
});

export const inactiveButton = (/* option: string */):InactiveButton=>({
    type: INACTIVE_BUTTON//,
    // data: option
})
```

අප සෑදූ app එකේ pass කිරීමට තරම් data නොමැති නිසා මෙය තරමක් පහසු වනු ඇත. නමුත් real-world app එකක් සාදන විට comment කර ඇති ආකාරයට action එකෙන් reducer එකට data pass කළ යුතුය.

දැන් අපි සාදා ගත් reducer එක rootReducer එකට ඇතුළත් කළ යුතුය. ඒ සඳහා `rootReducer.ts` file එක පහත ආකාරයට වෙනස් කළ යුතුය.

```ts
// rootReducer.ts

import switchComponent from "./store/switchComponent/reducers";

const rootReducer = combineReducers({
    switchComponent,
});
```

දැන් අප සාදා ගත් actions අපගේ component එකට සම්බන්ධ කළ යුතුය. ඒ සඳහා `react-redux` පැකේජය මගින් ලබා දෙන `connect` යන function එක භාවිතා කළ යුතුය.

```tsx
// components/SwitchComponent.tsx
import * as React from "react";
import { SwitchComponentState } from "../store/switchComponent/types";
import { AppState } from "../rootReducer";
import { Dispatch } from "redux";
import {connect} from "react-redux";
import { activeButton, inactiveButton } from "../store/switchComponent/actions";

export interface SwitchComponentProps extends SwitchComponentState {
    onActive: ()=>void;
    onInactive: ()=>void;
}

const mapStateToProps = (state:AppState)=>({
    ...state.switchComponent
});

const mapDispatchToProps = (dispatch: Dispatch)=>({
    onActive: ()=> dispatch(activeButton()),
    onInactive: ()=> dispatch(inactiveButton())
});

class SwitchComponent extends React.Component <SwitchComponentProps> {

    public render(){

        return (
            <button name="switch" id="switch" >Inactive</button>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (SwitchComponent);

```

`mapStateToProps` යනු state සියල්ලම props ලෙස ගැනීමට හැකි වන ලෙස සකසා ගැනීමයි. මෙම උදාහරණයේදී `switchComponent` reducer එකෙන් පමණක් ලැබෙන state props ලෙස ලබා ගන්නා ලදී. `mapDispatchToProps` යනු අප සාදා ගත් actions props ලෙස භාවිතා කිරීමට හැකි වන සේ සකසා ගැනීමයි.

`SwitchComponentProps extends SwitchComponentState` යනුවෙන් `SwitchComponentState` ට `SwitchComponentProps` extend කිරීම මගින් අපට නැවතත් එම component එකේ state වල types define කිරීමේ අවශ්‍යතාවයක් නැත.

දැන් සුපුරුදු පරිදි ඔබට ඔබගේ component එකෙහි action ක්‍රියා කරවීම සිදු කළ හැකිය.

```tsx
// components/SwitchComponent.tsx

class SwitchComponent extends React.Component <SwitchComponentProps> {

    protected handleClickButton = ()=>{
        const {onActive, onInactive, active} = this.props;

        if(active){
            onInactive();
        } else {
            onActive();
        }
    }

    public render(){
        const {active} = this.props;

        return (
            <button onClick={this.handleClickButton} name="switch" id="switch" >
                {active?"Active":"Inactive"}
            </button>
        );
    }
}

```

මෙහිදී switch එක active නම් inactive වන් අතර inactive නම් active වෙයි.

දැන් අපි අපගේ `App.tsx` file එකට අපගේ අලුත්ම `SwitchComponent` එක import කරමු.

```tsx
// App.tsx

import SwitchComponent from './components/SwitchComponent';

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <SwitchComponent />
        </div>
    </Provider>
  );
}

```

දැන් `yarn start` command එක run කිරීමෙන් ඔබට ඔබගේ ප්‍රථම typescript react redux app එක බලා ගැනීමට පුළුවන්.


