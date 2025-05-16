#!/usr/bin/env node

import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cmdPath = resolve(__dirname, "cmd.js");

function detectRunningTool() {
	if (process.versions.bun) {
		return "bun";
	}
	if (typeof Deno !== "undefined") {
		return "deno";
	}
	if (process.env.npm_execpath?.includes("pnpm")) {
		return "pnpm";
	}
	if (process.env.npm_execpath?.includes("yarn")) {
		return "yarn";
	}
	if (process.env.npm_execpath?.includes("npm")) {
		return "npm";
	}
	if (process.env.npm_execpath?.includes("turbo")) {
		return "turbo";
	}
	// Detect direct invocation with node
	if (process.argv[0]?.includes("node")) {
		return "direct invocation";
	}
	return null;
}

const tool = detectRunningTool();
if (tool) {
	console.log(`${tool.charAt(0).toUpperCase() + tool.slice(1)} detected.`);
	// Use dynamic import for ESM
	import(cmdPath);
} else {
	// Check for available package managers/runtimes
	const checkCommand = (command) => {
		try {
			execSync(`command -v ${command}`, { stdio: "ignore" });
			return true;
		} catch (e) {
			return false;
		}
	};

	// Try to run with the best available tool
	if (checkCommand("bun")) {
		execSync(`bun ${cmdPath}`, { stdio: "inherit" });
	} else if (checkCommand("deno")) {
		execSync(`deno run --allow-all ${cmdPath}`, { stdio: "inherit" });
	} else if (checkCommand("pnpm")) {
		execSync(`pnpm exec node ${cmdPath}`, { stdio: "inherit" });
	} else if (checkCommand("turbo")) {
		execSync(`turbo run exec -- node ${cmdPath}`, { stdio: "inherit" });
	} else if (checkCommand("yarn")) {
		execSync(`yarn node ${cmdPath}`, { stdio: "inherit" });
	} else if (checkCommand("npm")) {
		execSync(`npm exec -- node ${cmdPath}`, { stdio: "inherit" });
	} else {
		// Fallback to direct node
		execSync(`node ${cmdPath}`, { stdio: "inherit" });
	}
}
