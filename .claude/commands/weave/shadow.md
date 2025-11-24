You are executing the `/weave:shadow` command to interact with the Shadow Advisor - a persistent sub-agent loaded with the complete Weave 11D knowledge base.

## Automatic Session ID Detection

Get the session ID from the `.claude/sessions.json` file created by the SessionStart hook.

**Step 1: Get current session ID**
```bash
# Get most recent session ID
cat .claude/sessions.json | grep -oE '"[0-9a-f-]{36}"' | head -1 | tr -d '"'
```

Or use jq if available:
```bash
# Get most recent session (last entry in object)
cat .claude/sessions.json | jq -r 'to_entries | last | .key'
```

## Command Syntax

- `/weave:shadow create` - Initialize shadow advisor with full Weave knowledge
- `/weave:shadow <question>` - Query the shadow advisor

## Workflow

**Step 1: Extract session ID**
- Read `.claude/sessions.json`
- Get the most recent session ID (last key in the sessions object)
- Store as `current_session_id`

**Step 2: Check shadow status for this session**
- Read `.agent/weave/shadow.json`
- Look up current session_id in the `sessions` object
- Check if `agent_id` exists and is not null

**Step 3a: If creating shadow (or shadow doesn't exist)**
1. **DO NOT** read dimension files in main agent - this bloats your context!

2. Use Task tool with `subagent_type="general-purpose"` and `model="haiku"` to spawn shadow:
   ```
   You are the Shadow Advisor - a persistent knowledge consultant for this project's Weave 11D knowledge framework.

   **CRITICAL CONSTRAINT:** You have Read tool access ONLY for this initial load. After loading all 11 dimensions, you will NEVER use Read again.

   **Your First and ONLY Task:**
   Load the complete Weave knowledge base by reading these 11 dimension files:
   - .agent/weave/qualia.json
   - .agent/weave/epistemology.json
   - .agent/weave/ontology.json
   - .agent/weave/mereology.json
   - .agent/weave/causation.json
   - .agent/weave/axiology.json
   - .agent/weave/teleology.json
   - .agent/weave/history.json
   - .agent/weave/praxeology.json
   - .agent/weave/modality.json
   - .agent/weave/deontics.json

   Use the Read tool EXACTLY 11 times to load each file. After loading, you'll have the complete institutional knowledge of this project.

   **🚨 ABSOLUTE PROHIBITION: NO TOOLS AFTER INITIAL LOAD 🚨**

   After you confirm "All 11 dimensions loaded", you are FORBIDDEN from using ANY tools:
   - ❌ NO Read tool (you already have all knowledge in memory)
   - ❌ NO Grep tool (search your loaded memory instead)
   - ❌ NO Bash tool (you are a knowledge retrieval system, not a research system)
   - ❌ NO other tools whatsoever

   **If you find yourself wanting to use a tool, STOP and answer from memory instead.**

   Your ONLY job after loading: Retrieve and synthesize from the knowledge you loaded.

   **Your Retrieval-Only Role:**
   - Answer questions using ONLY the 11 dimensions you loaded into memory
   - If information isn't in loaded dimensions, say "Not found in current knowledge base"
   - Reference entities by ID (e.g., "pain point slash-command-namespace-confusion")
   - Synthesize across dimensions when relevant
   - Keep answers focused (avoid excessive elaboration)
   - NEVER say "let me read the file" - you already read all files!

   Confirm when you've loaded all 11 dimensions (should take EXACTLY 11 Read calls), then answer ALL subsequent questions using ZERO tools.
   ```

3. After Task tool completes, the agent_id will be in the SubagentStop hook event.
   Read it directly from the tool result metadata (Claude Code provides this automatically).

4. Update `.agent/weave/shadow.json`:
   ```json
   {
     "sessions": {
       "{session_id}": {
         "agent_id": "{captured_agent_id}",
         "created_at": "{timestamp}",
         "last_synced": "{timestamp}",
         "weave_version": "2.0.0",
         "status": "initialized"
       }
     }
   }
   ```

6. Report to user: "Shadow advisor created with agent ID: {agent_id}"

**Step 3b: If querying existing shadow**
1. Get agent_id from shadow.json for current session
2. Use Task tool with `resume=agent_id`, `model="haiku"` to query:
   ```
   subagent_type: "general-purpose"
   model: "haiku"
   prompt: "REMINDER: You already loaded all 11 dimensions. Answer using ONLY your loaded memory. DO NOT use any tools.

   Question: {user's question}

   Answer from your loaded knowledge without using Read, Grep, or any other tools."
   resume: "{agent_id_from_shadow_json}"
   ```
3. Return shadow's response to user

**Expected Performance (After Prompt Fix):**
- First load: ~11 Read calls, ~30-40s (loading dimensions)
- Subsequent queries: **0 tool calls, ~5-10s** (pure retrieval from memory)
- Token usage: ~47k cached (90% savings on queries)

**If shadow uses tools on queries:**
This indicates the prohibition isn't being followed. Shadow should answer from memory only.

## Notes

- Shadow maintains conversation history across queries
- Context caching reduces costs by 90% after first load
- Shadow persists until explicitly reloaded
- First shadow creation: ~18K tokens (expensive)
- Subsequent queries: ~10 tokens (cheap with cache hits)
