package question2;

public public static List<Integer> eraseZeroSumSegments(int[] array) {
    List result = new ArrayList<>();
    
            int sum = 0;
            for (int j = 0; j < array.length; j++) {
                sum += array[j];
                if (sum == 0) {
                    result.clear();
                    continue;
                    
                }else{
                    result.add(array[j]);
                }
            }
        
        
        return result;
    } 
