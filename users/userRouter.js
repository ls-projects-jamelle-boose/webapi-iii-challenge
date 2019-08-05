const express = require("express");
const ub = require("./userDb");
const pb = require("../posts/postDb");
const router = express.Router();

/**
|--------------------------------------------------
| ROUTES FOR /API/USER
|--------------------------------------------------
*/
router.delete("/:id", validateUserId, async (req, res) => {
  //TODO deconstruct ID from req.user
  const { id } = req.user;

  //TODO setup try/catch
  try {
    //TODO save asynchronous id, if id is found
    const removed = await ub.remove(id);
    if (removed)
      res.status(200).json({
        success: true,
        message: `User ${id} removed.`
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `User could not be removed.`
    });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  // TODO get the ID
  const { id } = req.user;
  try {
    // TODO save ID and body if ID exists, then PUT new data in
    const updated = await ub.update(id, req.body);
    if (updated) {
      console.log(updated);
      const user = await ub.getById(id);
      res.status(200).json({
        success: true,
        user
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: `User could not be modified.`
    });
  }
});

router.post("/:id/posts", validateUser, validatePost, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const post = { text, user_id: id };

  try {
    const newPost = await pb.insert(post);
    if (newPost)
      res.status(201).json({
        success: true,
        newPost
      });
  } catch (error) {
    res.status(500).json({
      message: `Post could not be created.`
    });
  }
});

router.post("/", validateUser, async (req, res) => {
  const { body } = req;
  const { name } = body;

  if (!name) {
    res.status(400).json({
      errorMessage: "Please provide name for the user."
    });
  } else {
    await ub
      .insert(body)
      .then(user => {
        res.status(201).json({
          user
        });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the user to the database.",
          err
        });
      });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await ub.get();
    if (users) res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: `Users could not be retrieved.`,
      err
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await ub.getUserPosts(req.user.id);

    if (posts.length === 0) {
      res.status(404).json({
        message: `User does not have any posts.`
      });
    } else
      res.status(200).json({
        success: true,
        posts
      });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: `User's posts could not be retrieved.`
    });
  }
});

// TODO CUSTOM MIDDLEWARE

async function validateUserId(req, res, next) {
  try {
    const user = await ub.getById(req.params.id);

    if (!user) {
      next({
        code: 400,
        message: `User ID is invalid.`
      });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next({
      code: 500,
      message: `User could not be validated.`
    });
  }
}

function validateUser(req, res, next) {
  try {
    const user = req.body;
    const length = Object.keys(user).length;

    if (length === 0)
      next({
        code: 400,
        message: `Missing user data.`
      });

    if (length > 0 && !user.name)
      next({
        code: 400,
        message: `Missing required name field.`
      });

    next();
  } catch (error) {
    next({
      code: 500,
      message: `User could not be validated.`
    });
  }
}

function validatePost(req, res, next) {
  console.log(req.body);
  try {
    const post = req.body;
    const length = Object.keys(post).length;

    if (length === 0)
      next({
        code: 400,
        message: `Missing required post data.`
      });

    if (length > 0 && !post.text)
      next({
        code: 400,
        message: `Missing required text field.`
      });

    next();
  } catch (error) {
    next({
      code: 500,
      message: `Post could not be validated.`
    });
  }
}

module.exports = router;
