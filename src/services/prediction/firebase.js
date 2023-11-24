import db from '../../utils/config.firebase.js';

import {collection, doc, getDoc, getDocs, query, setDoc} from "firebase/firestore";

export const nextEventFetch = async () => {
    const q = query(collection(db, 'schedule'));
    const querySnapshot = await getDocs(q);
    let events = [];
    querySnapshot.forEach((doc) => {
        events.push(doc.data().eventList.slice(0).sort((a, b) => a.fixture.timestamp < b.fixture.timestamp ? -1 : 1));
    });
    let fixtures = [];
    let startTimestamps = [];


    // events[0].forEach((e) => {
    //     fixtures.push(e.fixture.id);
    //     startTimestamps.push(e.fixture.timestamp);
    //
    // });
    events[1].forEach((e) => {
        fixtures.push(e.fixture.id);
        startTimestamps.push(e.fixture.timestamp);
    });

    return {
        fixtures: fixtures,
        startTimestamps: startTimestamps,
    }
}