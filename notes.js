const fs = require('fs')
const chalk = require('chalk')

// Add new note
const addNote = (title, body) => {
    const notes = loadNotes()
    notes.then(entries => {
        const loaded_notes = entries();
        const duplicate_note = loaded_notes.find(note => note.title === title)
    
        if (!duplicate_note) {
            loaded_notes.push({
                title: title,
                body: body,
            })
    
            saveNotes(loaded_notes)
            console.log(chalk.bgGreen.black('Note saved succesfully!'))
        } else {
            console.log(chalk.bgRed.black('A note with that title already exists'))
        }
    })
}

// Remove note
const removeNote = title => {
    const notes = loadNotes()
    notes.then(entries => {
        const loaded_notes = entries()
        const filtered_notes = loaded_notes.filter(note => note.title !== title)

        if (filtered_notes.length < loaded_notes.length) {
            saveNotes(filtered_notes)
            console.log(chalk.bgGreen.black('Note "' + title + '" deleted succesfully!'))
        } else {
            console.log(chalk.bgRed.black('No note with that title was found'))
        }
    })
}

// List all notes
const listNotes = () => {
    const notes = loadNotes()
    notes.then(entries => {
        const loaded_notes = entries()
        console.log(chalk.bgBlue.white('--Your notes--'))
        loaded_notes.forEach((el, i) => {
            console.log(chalk.blue(' ' + (i + 1) + '.- ' + el.title))
        })
    })
}

// Read a note
const readNote = title => {
    const notes = loadNotes()
    notes.then(entries => {
        const loaded_notes = entries()
        const note = loaded_notes.find(note => note.title === title)

        if (note) {
            console.log(chalk.bgYellowBright.black(note.title))
            console.log(chalk(note.body))
        } else {
            console.log(chalk.bgRed.black('No note with that title was found'))
        }
    })
}

// Save notes
const saveNotes = async function(notes) {
    const saveNotesP = () => {
        return new Promise(resolve => {
            const new_notes = JSON.stringify(notes)
            fs.writeFileSync('notes.json', new_notes)
        }).catch(reason => {
            console.log(chalk.bgRed.black('There was an error saving the notes: ' + reason))
        })
    }

    const saved_notes = await saveNotesP;
    saved_notes()
}

// Load notes
const loadNotes = async function () {
    const loadNotesP = function() {
        return new Promise(resolve => {
            resolve(() => {
                try {
                    const dataBuffer = fs.readFileSync('notes.json')
                    const dataJSON = dataBuffer.toString()
                    return JSON.parse(dataJSON)
                } catch (e) {
                    return []
                }
            })
        }).catch(reason => {
            console.log(chalk.bgRed.black('Unable to load notes: ' + reason))
        })
    }

    const loaded_notes = await loadNotesP();
    return loaded_notes;
}

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote,
}