from random import random

# numbers = []
# for i in range(100):
# 	numbers.append(10*random())
# numbers.append(numbers[47])
# print(numbers[47])

numbers = [
8.004059575772324,
8.161021117204086,
8.228517971910573,
8.295799790869529,
8.30825361405301,
8.489203471704666,
8.508153977939841,
8.581027058569523,
8.733020771739369,
8.839856187062596,
8.980199617356977
]
numbers = sorted(numbers)

decs = {}

def f(nrs,decimals,levels=0) :
	print("  "*levels, nrs,decimals)
	if len(nrs) == 1:
		decs[nrs[0]] = decimals - 1
		return
	hash = {}
	for nr in nrs:
		key = round(nr,decimals)
		if key not in hash: hash[key] = []
		hash[key].append(nr)
	for key in hash:
		f(hash[key],decimals + 1,levels+1)


numbers = sorted(list(set(numbers)))
f(numbers,0)

for nr in numbers:
	if decs[nr] == 0:
		print(nr,int(nr))
	else:
		print(nr,round(nr, decs[nr]))
