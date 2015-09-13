var _ = require('underscore')
var express = require('express')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var util = require('util')
var async = require('async')

var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy
var GitHubApi = require('github')
var config = require('./config.json')

var debug = true
var host = 'http://127.0.0.1'
var port = 9003

var github = new GitHubApi({
	version: '3.0.0',
	debug: debug,
	protocol: 'https',
	host: 'api.github.com',
	pathPrefix: '',
	timeout: 5000,
})

passport.serializeUser(function (user, done) {
	done(null, user)
})
passport.deserializeUser(function (obj, done) {
	done(null, obj)
})

passport.use(new GitHubStrategy(
	{
		clientID: config.github_client_id,
		clientSecret: config.github_client_secret,
		callbackURL: host + ':' + port + '/auth/github/callback',
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			github.authenticate({
				type: 'oauth',
				token: accessToken,
			})

			return done(null, profile)
		})
	}
))

var app = express()

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(bodyParser())
app.use(session({ store: new FileStore(), secret: 'banaan' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
	if ( ! req.user) return res.redirect('/login')
	github.pullRequests.getAll({
		user: req.user.username,
		repo: 'logotome-test',
	}, function (err, pullRequests) {
		if (err) console.error(err)

		pullRequests = _.filter(pullRequests, function (pr) {
			return pr.state === 'open'
		})

		async.eachSeries(pullRequests, function (pr, cb) {
			github.issues.getComments({
				user: req.user.username,
				repo: 'logotome-test',
				number: pr.number,
			}, function (err, comments) {
				if (err) return cb(err)
				pr.comments = comments
				verifyIfShouldBeMerged(pr, req.user.username, cb)
			})
		}, function (err) {
			res.render('index', {
				_: _,
				user: req.user,
				pullRequests: pullRequests,
			})
		})
	})
})

app.get(
	'/account',
	function (req, res, next) {
		if (req.isAuthenticated()) return next()
		res.redirect('/login')
	},
	function (req, res) {
		res.render('account', { user: req.user })
	}
)

app.get('/login', function (req, res) {
	res.render('login', { user: req.user })
})

app.get(
	'/auth/github',
	passport.authenticate('github', { scope: [ 'user:email', 'repo', 'admin:repo_hook' ] }),
	function (req, res) {}
)

app.get(
	'/auth/github/callback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	function (req, res) {
		res.redirect('/')
	}
)

app.get('/logout', function (req, res) {
	req.logout()
	res.redirect('/')
})

app.get(
	'/hook',
	function (req, res, next) {
		if (req.isAuthenticated()) return next()
		res.redirect('/login')
	},
	function (req, res) {
		github.pullRequests.getAll({
			user: req.user.username,
			repo: 'logotome-test',
		}, function (err, pullRequests) {
			if (err) console.error(err)

			console.log(pullRequests)
			pullRequests = _.filter(pullRequests, function (pr) {
				return pr.state === 'open' && pr.locked === false
			})

			async.eachSeries(pullRequests, function (pr, cb) {
				github.issues.getComments({
					user: req.user.username,
					repo: 'logotome-test',
					number: pr.number,
				}, function (err, comments) {
					if (err) return cb(err)
					pr.comments = comments
					verifyIfShouldBeMerged(pr, req.user.username, cb)
				})
			}, function (err) {
				async.eachSeries(pullRequests, function (pr, cb) {
					if ( ! pr.shouldMerge) return cb()

					console.log('merge', pr)

					github.pullRequests.merge({
						user: req.user.username,
						repo: 'logotome-test',
						number: pr.number,
						commit_message: 'Automatically merged by Logotome.',
						sha: pr.head.sha,
					}, function (err, data) {
						if (err) return cb(err.message)
						if ( ! data.merged) return cb(data.message)
						cb()
					})
				}, function (err) {
					if (err) {
						if (_.isObject(err) && err.message) {
							err = err.message
						}
						res.status(500).send(err)
					} else {
						res.send()
					}
				})
			})
		})
	}
)

function verifyIfShouldBeMerged (pr, username, cb) {
	github.repos.getContent({
		user: username,
		repo: 'logotome-test',
		path: 'VOTERS',
	}, function (err, file) {
		if (err) return cb(err)
		if (file.encoding !== 'base64') return cb('Cannot handle file encoding: ' + file.encoding)


		var voters = _.chain(new Buffer(file.content, file.encoding).toString('utf8').split('\n')).map(function (user) { return user.trim() }).filter().uniq().value()

		var users = _.chain(pr.comments).map(function (comment) {
			if (comment.body.match(/^LGTM/i) || comment.body.match(/^:\+1:/)) {
				return comment.user.login
			}
		}).filter().uniq().intersection(voters).value()

		var shouldMerge = (users.length / voters.length) >= 0.5

		pr.shouldMerge = shouldMerge
		cb()
	})
}

app.listen(port)
console.log('Listening on port', port)
