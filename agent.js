PITRI.Agent = function(config) 
{
	var defaults = {
		name: "Agent" + Math.random(),
		navigator: new PITRI.RandomNav({agent:this}),
		locomotor: new PITRI.PointMassLoco({agent:this}),
		skin: new PITRI.GenericAgentSkin()
	}
	
	// Internal reference to self.
	var me = this;
	
	// Merge defaults with given config.
	me.state = $.extend({}, defaults, config);
	
	// Do initialization here.
	me.init = function() 
	{
		// TODO
	}
	
	// Run the next iteration of the simulation.
	me.tick = function() 
	{
		// TODO: How will the navigator and the locomotor share state information?
		me.state.navigator.think();
		me.state.locomotor.move();
	}
	
	// Initialize.
	me.init();
}

PITRI.PointMassLoco = function(config) 
{
	var defaults = {
		maxSpeed: 5,
		maxForce: 10,
		position: new Vector(0,0),
		velocity: new Vector(0,0),
		accel: new Vector(0,0),
		inertia: new Vector(0,0),
		mass: 10
	}
	
	// Internal reference to self.
	var me = this;
	
	// Merge defaults with given.
	me.state = $.extend({}, defaults, config);
	
	// Do initialization here.
	me.init = function() 
	{
		// TODO
	}
	
	// Modify the point mass's properties according to the given steering 
	// force.
	me.move = function() 
	{
		var steer = config.agent.state.navigator.state.steer;
		
		// Calculate acceleration and truncate to maxAccel.
		me.state.accel.x = (steer.x / me.state.mass);
		me.state.accel.y = (steer.y / me.state.mass);
		
		// Calculate and truncate speed.
		me.state.velocity = me.state.velocity.add(me.state.accel);
		me.state.velocity.trunc(me.state.maxSpeed);
		
		// Move me!
		me.state.position = me.state.position.add(me.state.velocity);
	}
	
	// Initialize.
	me.init();
}

PITRI.RandomNav = function(config) 
{
	// Defaults
	var defaults = {
		steer: new Vector(0,0),
		targetDist: 10,
		maxDist: 80
	}
	
	// Internal reference to self.
	var me = this;
	
	// Merge defaults with config to form state.
	me.state = $.extend({}, defaults, config);
	
	// Do initialization here.
	me.init = function() 
	{
		// Acquire a random target.
		me.state.target = me.getNewTarget();
	}
	
	// Decides where to move to next based on the current target position and other environmental factors.
	me.think = function() 
	{
		var locomotor = config.agent.state.locomotor;
		
		// Do I need to choose a new target yet?
		var distance = me.state.target.sub(locomotor.state.position);
		distance = distance.len();
		if(distance < me.state.targetDist) {
			me.state.target = me.getNewTarget();
		}
	
		var position = config.agent.state.locomotor.state.position;
		var target = me.state.target;
		
		var desired = position.sub(target);
		desired = desired.mult(locomotor.state.maxSpeed);
		
		me.state.steer = locomotor.state.velocity.sub(desired);
		me.state.steer.trunc(locomotor.state.maxForce);
	}
	
	// Return a random target to move toward.
	me.getNewTarget = function() 
	{	 
		/*
		 * OK... This is an incredibly bad implementation for limiting the
		 * distance that the generated target will be from the Agent but I'm
		 * really stoned and I just wanted to see what it looks like.  I'll fix
		 * this later, I swear.
		 */
		 /*
		var distance = 80;
		try{
			var locomotor = config.agent.state.locomotor;
		} catch(err){
			minx = 0;
			maxx = 400;
			miny = 0;
			maxy = 400;
			var x = Math.randInt(minx, maxx);
			var y = Math.randInt(miny, maxy);
			
			return new Vector(x,y);
		}
		
		minx = locomotor.state.position.x - distance;
		maxx = locomotor.state.position.x + distance;
		if(minx < 0) minx = 0;
		if(maxx > 400) maxx = 400;
		
		miny = locomotor.state.position.y - distance;
		maxy = locomotor.state.position.y + distance;
		if(miny < 0) miny = 0;
		if(maxy > 400) maxy = 400;
		// End amazingly hack-ish code.
		
		var x = Math.randInt(minx, maxx);
		var y = Math.randInt(miny, maxy);
		*/
		var x = Math.randInt(0, 400);
		var y = Math.randInt(0, 400);
		
		return new Vector(x,y);
	}
	
	// Initialize.
	me.init();
}

PITRI.GenericAgentSkin = function(config) {
	// Defaults
	var defaults = {
		color: "rgb(0, 255, 0)",
		size: 10
	}
}