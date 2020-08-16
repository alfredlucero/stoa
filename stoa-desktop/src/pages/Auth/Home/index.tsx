import React, { useContext, useState, useEffect, useCallback } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useAuthSession } from "../../../auth";
import { FirebaseContext } from "../../../services/firebase";
import { Standup } from "../../../services/standups.interface";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { SlackWebClientContext } from "../../../services/slack";

// BRAINSTORM IDEAS
// What if we provided a way to say like copy standup and it will be formatted like Today: 1. 2. 3.; Yesterday: * * *?
// Or what if we can have a button assuming we have Slack integration to click and say output this update to my Slack channel?
const HomePage = () => {
  const { user } = useAuthSession();
  const firebase = useContext(FirebaseContext);

  // TODO: add in inline validation for checking today date is always after yesterday/last time date
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

  // TODO: create custom hook to encapsulate this list crud
  const [yesterdayUpdates, setYesterdayUpdates] = useState<string[]>([""]);
  const maxYesterdayUpdates = 10;
  const onChangeYesterdayUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: updateIdx, value } = e.currentTarget;
    const parsedUpdateIdx = parseInt(updateIdx, 10);
    const newYesterdayUpdates = [...yesterdayUpdates];
    newYesterdayUpdates[parsedUpdateIdx] = value;
    setYesterdayUpdates(newYesterdayUpdates);
  };
  const onClickAddYesterdayUpdate = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (yesterdayUpdates.length < maxYesterdayUpdates) {
      setYesterdayUpdates([...yesterdayUpdates, ""]);
    }
  };
  const onClickDeleteYesterdayUpdate = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const { name: updateIdx } = e.currentTarget;
    const parsedUpdateIdx = parseInt(updateIdx, 10);
    if (yesterdayUpdates.length > 1) {
      const newYesterdayUpdates = yesterdayUpdates.filter(
        (yesterdayUpdate, idx) => {
          return idx !== parsedUpdateIdx;
        }
      );
      setYesterdayUpdates(newYesterdayUpdates);
    } else {
      setYesterdayUpdates([""]);
    }
  };

  const [todayTodos, setTodayTodos] = useState<string[]>([""]);
  const maxTodayTodos = 10;
  const onChangeTodayTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: todoIdx, value } = e.currentTarget;
    const parsedTodoIdx = parseInt(todoIdx, 10);
    const newTodayTodos = [...todayTodos];
    newTodayTodos[parsedTodoIdx] = value;
    setTodayTodos(newTodayTodos);
  };
  const onClickAddTodayTodo = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (todayTodos.length < maxTodayTodos) {
      setTodayTodos([...todayTodos, ""]);
    }
  };
  const onClickDeleteTodayTodo = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name: todoIdx } = e.currentTarget;
    const parsedTodoIdx = parseInt(todoIdx, 10);
    if (todayTodos.length > 1) {
      const newTodayTodos = todayTodos.filter((todayTodo, idx) => {
        return idx !== parsedTodoIdx;
      });
      setTodayTodos(newTodayTodos);
    } else {
      setTodayTodos([""]);
    }
  };

  const [blockers, setBlockers] = useState<string[]>([""]);
  const maxBlockers = 5;
  const onChangeBlocker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: blockerIdx, value } = e.currentTarget;
    const parsedBlockerIdx = parseInt(blockerIdx, 10);
    const newBlockers = [...blockers];
    newBlockers[parsedBlockerIdx] = value;
    setBlockers(newBlockers);
  };
  const onClickAddBlocker = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (blockers.length < maxBlockers) {
      setBlockers([...blockers, ""]);
    }
  };
  const onClickDeleteBlocker = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name: blockerIdx } = e.currentTarget;
    const parsedBlockerIdx = parseInt(blockerIdx, 10);
    if (blockers.length > 1) {
      const newBlockers = blockers.filter((blocker, idx) => {
        return idx !== parsedBlockerIdx;
      });
      setBlockers(newBlockers);
    } else {
      setBlockers([""]);
    }
  };

  const [notes, setNotes] = useState<string[]>([""]);
  const maxNotes = 5;
  const onChangeNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: noteIdx, value } = e.currentTarget;
    const parsedNoteIdx = parseInt(noteIdx, 10);
    const newNotes = [...notes];
    newNotes[parsedNoteIdx] = value;
    setNotes(newNotes);
  };
  const onClickAddNote = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (notes.length < maxNotes) {
      setNotes([...notes, ""]);
    }
  };
  const onClickDeleteNote = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name: noteIdx } = e.currentTarget;
    const parsedNoteIdx = parseInt(noteIdx, 10);
    if (notes.length > 1) {
      const newNotes = notes.filter((note, idx) => {
        return idx !== parsedNoteIdx;
      });
      setNotes(newNotes);
    } else {
      setNotes([""]);
    }
  };

  // TODO: loading/success/error states for standups
  const [standups, setStandups] = useState<Standup[]>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("Failed to retrieve current authenticated user!");
      return;
    }
    const userId = user.uid;
    const standupToCreate = {
      userId,
      todayTimestamp: selectedTodayDate as Date,
      yesterdayTimestamp: selectedYesterdayDate as Date,
      yesterdayUpdates,
      todayTodos,
      blockers,
      notes,
    };
    firebase
      .createStandup(standupToCreate)
      .then((createdStandup) => {
        console.log("Document written with ID: ", createdStandup.id);
        console.log("Created standup", createdStandup);
        fetchStandups();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

  const fetchStandups = useCallback(() => {
    const userId = (user && user.uid) || "";
    console.log(user);
    firebase
      .getStandups({ userId })
      .then((querySnapshot) => {
        const standups: Standup[] = [];
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
          const standup: Standup = doc.data() as Standup;
          standups.push(standup);
        });
        console.log("Fetched standups", standups);
        setStandups(standups);
      })
      .catch(function (error) {
        console.error("Error fetching standups: ", error);
      });
  }, [firebase, user]);

  useEffect(() => {
    fetchStandups();
  }, [fetchStandups]);

  const slackWebClient = useContext(SlackWebClientContext);
  // Get channel id from url: https://app.slack.com/client/T0193FJN9GC/C018XG4NCTD/details/top
  // CXXX....
  const standupsTestChannelId = "C018XG4NCTD";

  const onClickPostSlackUpdate = async () => {
    try {
      const result = await slackWebClient.chat.postMessage({
        text: "Hello world!",
        channel: standupsTestChannelId,
        // as_user: true,
      });

      // The result contains an identifier for the message, `ts`.
      console.log(
        `Successfully send message ${result.ts} in conversation ${standupsTestChannelId}`
      );
    } catch (e) {
      console.error("Failed to send message to channel!");
    }
  };

  return (
    <Container maxWidth="lg">
      <Button variant="outlined" onClick={onClickPostSlackUpdate}>
        Post Slack Update
      </Button>
      <form onSubmit={onSubmit}>
        <h3>What days is this standup for?</h3>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="yyyy/MM/dd"
              margin="normal"
              id="date-picker-inline"
              label="What date was yesterday/last time?"
              value={selectedYesterdayDate}
              onChange={handleYesterdayDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={4}>
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
              fullWidth
            />
          </Grid>
        </Grid>

        <h3>What did I do yesterday/last time?</h3>
        {yesterdayUpdates.map((yesterdayUpdate, idx) => (
          <Grid container spacing={3} key={idx}>
            <Grid item xs={6}>
              <TextField
                name={`${idx}`}
                value={yesterdayUpdate}
                type="text"
                label={`Yesterday's Update #${idx + 1}`}
                onChange={onChangeYesterdayUpdate}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                name={`${idx}`}
                variant="outlined"
                color="secondary"
                onClick={onClickDeleteYesterdayUpdate}
                disabled={
                  yesterdayUpdates.length === 1 && yesterdayUpdates[0] === ""
                }
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        ))}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            disabled={yesterdayUpdates.length >= maxYesterdayUpdates}
            onClick={onClickAddYesterdayUpdate}
          >
            Add Update
          </Button>
        </Box>

        <h3>What do I plan to do today?</h3>
        {todayTodos.map((todayTodo, idx) => (
          <Grid container spacing={3} key={idx}>
            <Grid item xs={6}>
              <TextField
                name={`${idx}`}
                value={todayTodo}
                type="text"
                label={`Today's Todo #${idx + 1}`}
                onChange={onChangeTodayTodo}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                name={`${idx}`}
                variant="outlined"
                color="secondary"
                onClick={onClickDeleteTodayTodo}
                disabled={todayTodos.length === 1 && todayTodos[0] === ""}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        ))}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            disabled={todayTodos.length >= maxTodayTodos}
            onClick={onClickAddTodayTodo}
          >
            Add Todo
          </Button>
        </Box>

        <h3>Are there any blockers?</h3>
        {blockers.map((blocker, idx) => (
          <Grid container spacing={3} key={idx}>
            <Grid item xs={6}>
              <TextField
                name={`${idx}`}
                value={blocker}
                type="text"
                label={`Blocker #${idx + 1}`}
                onChange={onChangeBlocker}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                name={`${idx}`}
                variant="outlined"
                color="secondary"
                onClick={onClickDeleteBlocker}
                disabled={blockers.length === 1 && blockers[0] === ""}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        ))}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            disabled={blockers.length >= maxBlockers}
            onClick={onClickAddBlocker}
          >
            Add Blocker
          </Button>
        </Box>

        <h3>Are there any notes/16th minute items?</h3>
        {notes.map((note, idx) => (
          <Grid container spacing={3} key={idx}>
            <Grid item xs={6}>
              <TextField
                name={`${idx}`}
                value={note}
                type="text"
                label={`Note #${idx + 1}`}
                onChange={onChangeNote}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                name={`${idx}`}
                variant="outlined"
                color="secondary"
                onClick={onClickDeleteNote}
                disabled={notes.length === 1 && notes[0] === ""}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        ))}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            disabled={notes.length >= maxNotes}
            onClick={onClickAddNote}
          >
            Add Note
          </Button>
        </Box>
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            fullWidth
          >
            Save Standup
          </Button>
        </Box>
      </form>

      <div>Fetched Standups</div>
      {standups.map((standup: Standup, standupIdx: number) => (
        <div key={standupIdx}>
          <p>
            Today (Some Date) {standup.todayTimestamp.toDate().toDateString()}
          </p>
          {standup.todayTodos.map((todayTodo: string, todayTodoIdx: number) => (
            <p key={todayTodoIdx}>{todayTodo}</p>
          ))}
          <p>
            Yesterday/Last Time{" "}
            {standup.yesterdayTimestamp.toDate().toDateString()}
          </p>
          {standup.yesterdayUpdates.map(
            (yesterdayUpdate: string, yesterdayUpdateIdx: number) => (
              <p key={yesterdayUpdateIdx}>{yesterdayUpdate}</p>
            )
          )}
          {standup.blockers.map((blocker: string, blockerIdx: number) => (
            <p key={blockerIdx}>{blocker}</p>
          ))}
          {standup.notes.map((note: string, noteIdx: number) => (
            <p key={noteIdx}>{note}</p>
          ))}
        </div>
      ))}
    </Container>
  );
};

interface StandupCardProps {
  standup: Standup;
  onAddTodayTodoToStandupForm: (todayTodo: string) => void;
  onAddYesterdayUpdateToStandupForm: (yesterdayUpdate: string) => void;
  onAddBlockerToStandupForm: (blocker: string) => void;
  onAddNoteToStandupForm: (note: string) => void;
}

const StandupCard: React.FC<StandupCardProps> = ({
  standup,
  onAddTodayTodoToStandupForm,
  onAddYesterdayUpdateToStandupForm,
  onAddBlockerToStandupForm,
  onAddNoteToStandupForm,
}) => {
  return <div>Standup Card</div>;
};

export default HomePage;
