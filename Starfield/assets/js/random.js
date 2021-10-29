// Random numbers using standard Normal variate by Box-Muller transform.
function rng_normal(mu,sigma) {
    if (mu === undefined) mu = 0;
    if (sigma === undefined) sigma = 1.0;

    var u = 0, v = 0;
    while(u == 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v == 0) v = Math.random();

    var mag = sigma * Math.sqrt(-2.0 * Math.log(u));
    return mag * Math.cos(2*Math.PI * v) + mu;
    //var z1  = mag * sin(two_pi * v) + mu;
}

//Returns normal function probability density function
function normal_pdf(x,mu,sigma){
    return 1/(sigma*Math.sqrt(2)*Math.PI)*Math.exp(-1/2*(x-mu)*(x-mu)/sigma/sigma)
}
