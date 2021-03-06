import React, { useContext, useState, useEffect, useCallback } from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import { KeyboardDatePicker } from "@material-ui/pickers";
import CopyToClipboard from "react-copy-to-clipboard";
import { useAuthSession } from "../../../auth";
import { FirebaseContext } from "../../../services/firebase";
import { Standup } from "../../../services/standups.interface";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { SlackWebClientContext } from "../../../services/slack";
{
  /* <Paper elevation={3} /> */
}
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

  const onClickPostDiscordUpdate = () => {
    const discordWebhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL || "";

    fetch(discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "Alfred",
        content: `Today:\n\`\`\`* 1\n* 2\n* 3\n\`\`\`Yesterday:\`\`\`* 1\n* 2\n* 3\n\`\`\``,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Succeeded to send discrod update");
        }

        throw new Error("Failed to send discrod update!");
      })
      .catch((e) => console.error("Failed to send discord update", e));
  };

  const [isStandupPreviewModalOpen, setIsStandupPreviewModalOpen] = useState(
    false
  );
  const onClickShowStandupPreviewModal = () => {
    setIsStandupPreviewModalOpen(true);
  };
  const onCloseStandupPreviewModal = () => {
    setIsStandupPreviewModalOpen(false);
  };
  const standupPreview = {
    yesterdayUpdates,
    todayTodos,
    blockers,
    notes,
  };

  return (
    <Container maxWidth="lg">
      <Button variant="outlined" onClick={onClickPostSlackUpdate}>
        Post Slack Update
      </Button>
      <Button variant="outlined" onClick={onClickPostDiscordUpdate}>
        Post Discord Update
      </Button>
      <Button variant="outlined" onClick={onClickShowStandupPreviewModal}>
        Preview Standup
      </Button>

      <StandupPreviewModal
        standupPreview={standupPreview}
        isOpen={isStandupPreviewModalOpen}
        onClose={onCloseStandupPreviewModal}
      />

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

interface StandupPreviewModalProps {
  standupPreview: StandupPreview;
  isOpen: boolean;
  onClose: () => void;
}

interface StandupPreview {
  yesterdayUpdates: string[];
  todayTodos: string[];
  blockers: string[];
  notes: string[];
}

/*
  Expanded version

  Yesterday:
  • Did some thing yesterday...

  Today:
  • Do some things today...

  Blockers:
  • Things blocking us...

  16th:
  • 16th minute items...

  Compressed version

  Y: Did some things yesterday...
  T: Do some things today...
  B: Things blocking us...
  16th: 16th minute items...
*/
const StandupPreviewModal: React.FC<StandupPreviewModalProps> = ({
  standupPreview,
  isOpen,
  onClose,
}) => {
  const yesterdayUpdates = standupPreview.yesterdayUpdates.filter(
    (yesterdayUpdate) => yesterdayUpdate
  );
  const todayTodos = standupPreview.todayTodos.filter((todayTodo) => todayTodo);
  const blockers = standupPreview.blockers.filter((blocker) => blocker);
  const notes = standupPreview.notes.filter((note) => note);

  const expandedStandupText = `Yesterday:\n${yesterdayUpdates
    .map((yesterdayUpdate) => `• ${yesterdayUpdate}\n`)
    .join("")}Today:\n${todayTodos
    .map((todayTodo) => `• ${todayTodo}\n`)
    .join("")}${
    blockers.length > 0
      ? "Blockers:\n" + blockers.map((blocker) => `• ${blocker}\n`).join("")
      : ""
  }${
    notes.length > 0
      ? "16th Minute Items:\n" + notes.map((note) => `• ${note}\n`).join("")
      : ""
  }`;
  const [isExpandedStandupCopied, setIsExpandedStandupCopied] = useState(false);
  const onCopyExpandedStandup = () => {
    setIsExpandedStandupCopied(true);
    setTimeout(() => {
      setIsExpandedStandupCopied(false);
    }, 1000);
  };

  const compressedStandupText = `Y: ${yesterdayUpdates.join(
    ", "
  )}\nT: ${todayTodos.join(", ")}${
    blockers.length > 0 ? "\nB: " + blockers.join(", ") : ""
  }${notes.length > 0 ? "\n16th: " + notes.join(", ") : ""}`;
  const [isCompressedStandupCopied, setIsCompressedStandupCopied] = useState(
    false
  );
  const onCopyCompressedStandup = () => {
    setIsCompressedStandupCopied(true);
    setTimeout(() => {
      setIsCompressedStandupCopied(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div>
        <p>
          Preview your Standup and Copy and Paste it your chat application
          channel such as one in Slack, Discord, or Microsoft Teams.
        </p>

        <h3>Expanded Standup</h3>
        <CopyToClipboard
          text={expandedStandupText}
          onCopy={onCopyExpandedStandup}
        >
          <Button variant="outlined">
            {isExpandedStandupCopied && <>Copied Expanded Standup!</>}
            {!isExpandedStandupCopied && <>Copy Expanded Standup</>}
          </Button>
        </CopyToClipboard>
        <Paper elevation={3}>
          <>
            <p>Yesterday:</p>
            {yesterdayUpdates.map((yesterdayUpdate, idx) => (
              <p key={idx}>• {yesterdayUpdate}</p>
            ))}
            <p>Today:</p>
            {todayTodos.map((todayTodo, idx) => (
              <p key={idx}>• {todayTodo}</p>
            ))}
            {blockers.length > 0 && (
              <>
                <p>Blockers:</p>
                {blockers.map((blocker, idx) => (
                  <p key={idx}>• {blocker}</p>
                ))}
              </>
            )}

            {notes.length > 0 && (
              <>
                <p>16th Minute Items:</p>
                {notes.map((note, idx) => (
                  <p key={idx}>• {note}</p>
                ))}
              </>
            )}
          </>
        </Paper>

        <h3>Compressed Standup</h3>
        <CopyToClipboard
          text={compressedStandupText}
          onCopy={onCopyCompressedStandup}
        >
          <Button variant="outlined">
            {isCompressedStandupCopied && <>Copied Compressed Standup!</>}
            {!isCompressedStandupCopied && <>Copy Compressed Standup</>}
          </Button>
        </CopyToClipboard>
        <Paper elevation={3}>
          <>
            <p>Y: {yesterdayUpdates.join(", ")}</p>
            <p>T: {todayTodos.join(", ")}</p>
            {blockers.length > 0 && <p>B: {blockers.join(", ")}</p>}
            {notes.length > 0 && <p>16th: {notes.join(", ")}</p>}
          </>
        </Paper>
      </div>
    </Dialog>
  );
};

export default HomePage;
