const knex = require("../database/knex")

class NotesController {
  async create(request, response) {
    const { title, description, tags, } = request.body
    const user_id = request.user.id

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      user_id
   
    })

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("movie_tags").insert(tagsInsert)

   return response.json()
  }

  async show (request, response){
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ note_id: id}).orderBy("name");

    return response.json({
      ...note,
       tags
      })
  }

  async delete (request, response){
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json

  }

  async index(request, response){
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let movie_notes;

    if(tags){
      const filterTags = tags.split(',').map(tag => tag);

      notes = await knex("movie_tags")

      .select([
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.user_id",
      ])
      .where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.title",`%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("movie_notes", "movie_notes.id", "tags.note_id")
      .orderBy("notes.title")

    }else{
    notes = await knex ("movie_notes")
    .where({ user_id })
    .whereLike("title", `%${title}%`)
    .orderBy("title");

  }

  const userTags = await knex("movie_tags").where({ user_id });
  const notesWhitTags = movie_notes.map(note => {
    const noteTags = userTags.filter(tag => tag.note === note.id);

    return{
      ...note, 
      tags: noteTags
    }
  })

  return response.json(notesWhitTags);
  }

}

module.exports = NotesController