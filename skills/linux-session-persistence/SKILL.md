---
name: linux-session-persistence
description: Use when an interactive Linux task must survive SSH disconnects, a non-interactive command needs durable logs, an unstable network requires mosh, or scientific work must be routed to a scheduler instead of a login-node terminal. Covers tmux, GNU screen, nohup, systemd user units, mosh, recovery, and boundaries with HPC schedulers.
---

# Linux Session Persistence

Choose persistence based on the workload. SSH keepalives can detect a dead
connection; they do not preserve a process after the connection fails.

| Need | Preferred mechanism |
| --- | --- |
| Interactive terminal that survives disconnects | `tmux` |
| Existing legacy workflow | GNU `screen` |
| One non-interactive command with basic logs | `nohup` or `systemd-run --user` |
| Repeated or service-like user task | systemd user service/timer |
| HPC compute | Slurm/PBS/other site scheduler |
| Roaming or unreliable interactive network | `mosh` plus `tmux` |

Do not use `tmux`, `screen`, or `nohup` to bypass an institutional scheduler or
to run large compute jobs on a login node.

## tmux

Name sessions by purpose and keep durable logs outside the terminal scrollback:

```bash
tmux new-session -s genome-qc
# Inside tmux: start the work, preferably with explicit log files.
tmux detach
tmux ls
tmux attach -t genome-qc
```

Use a narrow command scope: one session per coherent workflow, named windows for
separate tasks, and commands that write output/logs to project directories. On
reconnect, inspect process state and logs before starting a duplicate run.

End a confirmed completed session deliberately:

```bash
tmux kill-session -t genome-qc
```

## GNU screen

Use `screen` when it is already the local convention or `tmux` is unavailable:

```bash
screen -S genome-qc
# Detach with Ctrl-a d.
screen -ls
screen -r genome-qc
```

Avoid creating nested multiplexers without explaining the prefix-key behavior.

## Non-Interactive Work

Use `nohup` only for a simple command with redirected logs and an explicit PID
or output marker:

```bash
mkdir -p logs
nohup tool input > logs/tool.out 2> logs/tool.err < /dev/null &
echo $! > logs/tool.pid
```

For a user-level service with a clear lifecycle, prefer `systemd-run --user` or
its exit status and outputs have been verified.

## mosh

Use `mosh` only when the server supports it, UDP ports are allowed by policy,
and the user needs roaming or network-change tolerance:

```bash
mosh research-server
```

`mosh` improves interactivity but does not replace `tmux` for running processes
or `rsync` for transfers. It may not work through every bastion or firewall.

## HPC Boundary

Before scientific computation, identify the host role and site scheduler. Use an
interactive allocation or a batch job for resource-managed work. Record job ID,
resources, output paths, and terminal state. The `hpc-bioinformatics-operations`

## Recovery And Completion

After a disconnect, first list sessions, inspect logs, and check output
timestamps. Do not relaunch a command until duplicate work, file locks, partial
outputs, and scheduler jobs have been ruled out.

The task is complete when the process has a known terminal state, logs and
outputs are preserved, expected artifacts pass their checks, and no unwanted
session, background job, or allocation remains.
