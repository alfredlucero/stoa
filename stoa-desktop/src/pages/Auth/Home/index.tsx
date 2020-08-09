import React, { useContext, useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useAuthSession } from "../../../auth";
import { FirebaseContext } from "../../../services/firebase";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

const HomePage = () => {
  const { user } = useAuthSession();
  const firebase = useContext(FirebaseContext);

  const [selectedTodayDate, setSelectedTodayDate] = useState<
    MaterialUiPickersDate
  >(new Date());
  const handleTodayDateChange = (date: MaterialUiPickersDate) => {
    setSelectedTodayDate(date);
  };

  const [selectedYesterdayDate, setSelectedYesterdayDate] = useState<
    MaterialUiPickersDate
  >(new Date());
  const handleYesterdayDateChange = (date: MaterialUiPickersDate) => {
    setSelectedYesterdayDate(date);
  };

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
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="date-picker-inline"
          label="What date is today?"
          value={selectedTodayDate}
          onChange={handleTodayDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <h3>What do I plan to do today?</h3>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="date-picker-inline"
          label="What date is yesterday/last time?"
          value={selectedYesterdayDate}
          onChange={handleYesterdayDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <h3>What did I do yesterday/last time?</h3>
        <h3>Any blockers?</h3>
        <h3>Any 16th minute items or notes?</h3>
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
