#!/usr/bin/env -S ts-node --esm
//
// Check if other programs are already using ports used in `make watch-dev`.
// If any, show them to user and give an option to kill them, and continue.
//
import confirm from "@inquirer/confirm";
import { exit } from "node:process";
import { $ } from "zx";

$.verbose = false;

const PORTS_TO_CHECK = [3000, ] as const;

const truncateWithEllipsisIfTooLong = (str: string) => {
  return str.length < 64 ? str : str.slice(0, 61) + "...";
};

const getPidUsingPort = async (port: number) => {
  try {
    return Number.parseInt(
      (await $`lsof -i :${port} -sTCP:LISTEN -t`).toString().trim(),
    );
  } catch {
    return undefined;
  }
};

const getProgramCommandFromPid = async (pid: number) => {
  try {
    return (await $`ps -p ${pid} -o 'command='`).toString().trim();
  } catch {
    return undefined;
  }
};

const resultTable: {
  port: number;
  pid: number;
  programCommand: string | undefined;
}[] = [];

// Construct {port, pid, programCommand}[] result table.
await Promise.all(
  PORTS_TO_CHECK.map(async (port) => {
    const pid = await getPidUsingPort(port);
    if (pid === undefined) return;

    const programCommand = await getProgramCommandFromPid(pid);

    resultTable.push({
      port,
      pid,
      programCommand:
        programCommand === undefined
          ? undefined
          : truncateWithEllipsisIfTooLong(programCommand),
    });
  }),
);

if (resultTable.length === 0) exit(0);

// eslint-disable-next-line no-console -- Fix this lint error.
console.table(resultTable);

const answer = await confirm({
  message:
    "These ports are already used by the above programs.  Kill them and continue?",
  default: false,
});

if (!answer) exit(1);

$.verbose = true;

for (const pid of new Set(resultTable.map((row) => row.pid))) {
  await $`kill ${pid}`;
}
