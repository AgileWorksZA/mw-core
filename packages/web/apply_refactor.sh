#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <dump_file_to_apply>"
    echo "Example: $0 refactored_dump.txt"
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "Error: Dump file '$1' not found."
    exit 1
fi

DUMP_FILE="$1"

echo "Applying changes from '$DUMP_FILE'..."
echo "WARNING: This will overwrite existing files. Ensure you have backed up your work."
echo "You have 5 seconds to press Ctrl+C to cancel..."
sleep 5
echo "Proceeding..."

gawk '
BEGIN {
    in_file_content = 0
    current_output_file = ""
    file_marker_regex = "^<<<<< FILE: (.*) >>>>>$"
}

$0 ~ file_marker_regex {
    if (in_file_content && current_output_file != "") {
        close(current_output_file)
    }
    match($0, file_marker_regex, arr)
    current_filename = arr[1]
    last_slash_pos = match(current_filename, "/[^/]*$")
    if (last_slash_pos > 0) {
        dir_to_create = substr(current_filename, 1, RSTART -1)
        if (dir_to_create != "" && dir_to_create != "/") {
             system("mkdir -p -- \"" dir_to_create "\"")
        }
    }
    current_output_file = current_filename
    in_file_content = 1
    next
}

in_file_content && current_output_file != "" {
    print $0 > current_output_file
}

END {
    if (in_file_content && current_output_file != "") {
        close(current_output_file)
    }
}
' "${DUMP_FILE}"

echo "Successfully applied changes from '${DUMP_FILE}'."
echo "Please review changes with 'git status' and 'git diff'."
