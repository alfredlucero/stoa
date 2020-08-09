import React, { useContext, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useAuthSession } from "../../../auth";
import { FirebaseContext } from "../../../services/firebase";

const HomePage = () => {
  const { user } = useAuthSession();
  const firebase = useContext(FirebaseContext);
  // TODO: loading/success/error states for standups
  const [standups, setStandups] = useState<any>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const userId = (user && user.uid) || "";
    console.log(user);
    firebase.getStandups({ userId }).then((querySnapshot) => {
      const standups: any = [];
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        const standup = doc.data();
        standups.push(standup);
      });
      console.log("Fetched standups", standups);
      setStandups(standups);
    });
  }, [firebase, user]);

  return (
    <div>
      <h2>Home</h2>
      <form onSubmit={onSubmit}>
        <TextField id="email" />
      </form>
      <div>Fetched Standups</div>
      {standups &&
        standups.map((standup: any, standupKey: string) => (
          <div key={standupKey}>
            <p>
              Today (Some Date) {standup.todayTimestamp.toDate().toDateString()}
            </p>
            {standup.todayTodos.map(
              (todayTodo: string, todayTodoKey: string) => (
                <p key={todayTodoKey}>{todayTodo}</p>
              )
            )}
            <p>
              Yesterday/Last Time{" "}
              {standup.yesterdayTimestamp.toDate().toDateString()}
            </p>
            {standup.yesterdayUpdates.map(
              (yesterdayUpdate: string, yesterdayUpdateKey: string) => (
                <p key={yesterdayUpdateKey}>{yesterdayUpdate}</p>
              )
            )}
            {standup.blockers.map((blocker: string, blockerKey: string) => (
              <p key={blockerKey}>{blocker}</p>
            ))}
            {standup.notes.map((note: string, noteKey: string) => (
              <p key={noteKey}>{note}</p>
            ))}
          </div>
        ))}
    </div>
  );
};

export default HomePage;
