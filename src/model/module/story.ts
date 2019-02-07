
/**
 * This module defines basic story structure.  There are three general types
 * of story:
 *   - an "epic": describes the general over-arching story flow.  There is
 *     usually one or two of these per game.
 *   - an "adventure": a voyage story describing the adventure of a crew to
 *     a far-away land.  This is the basic story structure.
 *   - a "quest": A small subplot or side story.  These are small obsticles
 *     that the crew must overcome during the adventure.
 *
 * A story has:
 *   - narrator.  The person writing the story.  They have different attributes
 *      that control the tone of the text, writing style, and other features.
 *   - roles.  The story defines named roles that are used as placeholders for
 *      the generated story text.  These are things like "location",
 *      "antagonist", "transportation".  Some roles depend upon others to
 *      be discovered first.  The role is a template for populating the
 *      story with things and the way those things are interacted with.
 * The story defines the required items for itself, and some basic requirements
 * that are defined by the context.
 */
