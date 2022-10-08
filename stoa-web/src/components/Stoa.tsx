import React, { useState, useMemo } from "react";

export const Stoa = () => {
  const { todayDate, todayWeekDay, todayDisplayDate } = useMemo(() => {
    const todayDate = new Date();
    const todayWeekDay = todayDate.toLocaleDateString("en-us", {
      weekday: "long",
    });
    const todayDisplayDate = todayDate.toLocaleDateString();
    return {
      todayDate,
      todayWeekDay,
      todayDisplayDate,
    };
  }, []);

  const { yesterdayDate, yesterdayWeekDay, yesterdayDisplayDate } =
    useMemo(() => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const yesterdayWeekDay = currentDate.toLocaleDateString("en-us", {
        weekday: "long",
      });
      const yesterdayDisplayDate = currentDate.toLocaleDateString();
      return {
        yesterdayDate: currentDate,
        yesterdayWeekDay,
        yesterdayDisplayDate,
      };
    }, []);

  const [currentYesterdayDescription, setCurrentYesterdayDescription] =
    useState("");
  const [yesterdayList, setYesterdayList] = useState<
    {
      id: number;
      description: string;
    }[]
  >([
    {
      id: new Date().setDate(new Date().getDate() - 1),
      description: "I finished this ticket yesterday.",
    },
  ]);
  const [todayList, setTodayList] = useState<
    { id: number; description: string }[]
  >([
    {
      id: new Date().getTime(),
      description: "I will work on this task today.",
    },
  ]);
  const [currentTodayDescription, setCurrentTodayDescription] = useState("");

  return (
    <>
      <h2 className="text-4xl text-slate-700 font-bold my-2">
        Yesterday - {yesterdayWeekDay}, {yesterdayDisplayDate}
      </h2>
      <p className="text-lg text-slate-700 font-bold my-2">
        What did I do yesterday?
      </p>
      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          onChange={(e) => {
            setCurrentYesterdayDescription(e.target.value);
          }}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 shadow-md"
          value={currentYesterdayDescription}
        />
        <button
          className="bg-sky-500 hover:bg-sky-700 px-3 py-2 text-sm leading-5 rounded-md font-semibold text-white shadow-md ml-4"
          onClick={() => {
            if (!currentYesterdayDescription) {
              return;
            }

            setYesterdayList([
              ...yesterdayList,
              {
                id: new Date().getTime(),
                description: currentYesterdayDescription,
              },
            ]);
            setCurrentYesterdayDescription("");
          }}
        >
          Add
        </button>
      </div>

      <ul className="list-disc py-4 px-6">
        {yesterdayList.map((yesterdayItem, key) => {
          return (
            <li key={key} className="pl-2">
              <span className="mr-4">{yesterdayItem.description}</span>

              <button
                onClick={() => {
                  setYesterdayList(
                    yesterdayList.filter((item) => item.id !== yesterdayItem.id)
                  );
                }}
                className="bg-red-500 hover:bg-red-700 px-3 py-2 text-sm leading-5 rounded-md font-semibold text-white"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      <h2 className="text-4xl text-slate-700 font-bold my-2">
        Today - {todayWeekDay}, {todayDisplayDate}
      </h2>
      <p className="text-lg text-slate-700 font-bold my-2">
        What am I going to do today?
      </p>
      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          onChange={(e) => {
            setCurrentTodayDescription(e.target.value);
          }}
          value={currentTodayDescription}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 shadow-md"
        />
        <button
          className="bg-sky-500 hover:bg-sky-700 px-3 py-2 text-sm leading-5 rounded-md font-semibold text-white ml-4"
          onClick={() => {
            if (!currentTodayDescription) {
              return;
            }

            setTodayList([
              ...todayList,
              {
                id: new Date().getTime(),
                description: currentTodayDescription,
              },
            ]);
            setCurrentTodayDescription("");
          }}
        >
          Add
        </button>
      </div>

      <ul className="list-disc py-4 px-6">
        {todayList.map((todayItem, key) => {
          return (
            <li key={key} className="pl-2">
              <span className="mr-4">{todayItem.description}</span>

              <button
                onClick={() => {
                  setTodayList(
                    todayList.filter((item) => item.id !== todayItem.id)
                  );
                }}
                className="bg-red-500 hover:bg-red-700 px-3 py-2 text-sm leading-5 rounded-md font-semibold text-white"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
