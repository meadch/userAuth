import { Router } from 'express';
const mainRouter = Router();

/* GET home page. */
mainRouter.route('/')
  .get(ensureAuthenticated, (req, res) => {
    res.render('index', { title: 'Members' });
  })

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  req.flash('error', "Please login")
  res.redirect('/users/login');
}

export default mainRouter;
